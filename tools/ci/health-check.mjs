import { Socket } from 'node:net';
import { readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const TIMEOUT_MS = 120_000;
const POLL_MS = 1_000;
const PROGRESS_LOG_INTERVAL_MS = 5_000;
const LOG_TAIL_LINES = 120;
const FORCE_FRESH = process.argv.includes('--fresh');

const services = [
  {
    name: 'admin',
    port: 3000,
    healthChecks: [['http://127.0.0.1:3000/api/health', 'http://localhost:3000/api/health']],
    commandArgs: ['.nx/nxw.js', 'serve', 'admin', '--configuration=production'],
  },
  {
    name: 'site',
    port: 4200,
    healthChecks: [['http://127.0.0.1:4200/zh', 'http://localhost:4200/zh']],
    commandArgs: ['.nx/nxw.js', 'serve', 'site'],
  },
];

const runningChildren = new Set();

process.on('SIGINT', async () => {
  await stopAllChildren();
  process.exit(130);
});

process.on('SIGTERM', async () => {
  await stopAllChildren();
  process.exit(143);
});

async function main() {
  await assertProjectConfig();

  for (const service of services) {
    const portFree = await isPortFree(service.port);
    if (!portFree) {
      if (FORCE_FRESH) {
        await ensurePortIsFree(service.port, service.name);
      }

      if (FORCE_FRESH) {
        await verifyServiceStartup(service);
        continue;
      }

      const healthy = await areHealthChecksReachable(service.healthChecks);
      if (healthy) {
        console.log(`[${service.name}] port ${service.port} already in use and healthy, reusing existing service`);
        continue;
      }

      await ensurePortIsFree(service.port, service.name);
    }

    await verifyServiceStartup(service);
  }

  console.log('All service startup checks passed.');
}

async function assertProjectConfig() {
  const siteProject = JSON.parse(await readFile(path.join(ROOT, 'apps', 'site', 'project.json'), 'utf8'));

  const siteAllowedHosts = siteProject?.targets?.serve?.options?.allowedHosts;
  const hasLocalhost = Array.isArray(siteAllowedHosts) && siteAllowedHosts.includes('localhost');
  const hasLoopback = Array.isArray(siteAllowedHosts) && siteAllowedHosts.includes('127.0.0.1');

  if (!hasLocalhost || !hasLoopback) {
    throw new Error(
      `site serve allowedHosts must include localhost and 127.0.0.1; current value: ${JSON.stringify(siteAllowedHosts)}`,
    );
  }
}

async function verifyServiceStartup(service) {
  const logBuffer = [];
  console.log(`\n[${service.name}] Starting...`);

  const child = spawn(process.execPath, service.commandArgs, {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...service.env },
  });

  runningChildren.add(child);
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => appendLog(logBuffer, chunk));
  child.stderr.on('data', (chunk) => appendLog(logBuffer, chunk));

  const exitPromise = new Promise((resolve) => {
    child.once('exit', (code, signal) => resolve({ code, signal }));
  });

  try {
    await waitForHealthOrExit(service, exitPromise);
    console.log(`[${service.name}] Healthy`);
  } catch (error) {
    const exited = await Promise.race([
      exitPromise,
      new Promise((resolve) => setTimeout(() => resolve(null), 5)),
    ]);
    if (exited) {
      const { code, signal } = exited;
      console.error(`[${service.name}] Process exited early. code=${code} signal=${signal}`);
    }
    printLogTail(service.name, logBuffer);
    throw error;
  } finally {
    await stopChild(child);
    runningChildren.delete(child);
  }
}

async function waitForHealthOrExit(service, exitPromise) {
  const start = Date.now();
  let lastProgressAt = 0;

  while (Date.now() - start <= TIMEOUT_MS) {
    const exited = await Promise.race([
      exitPromise,
      new Promise((resolve) => setTimeout(() => resolve(null), 0)),
    ]);

    if (exited) {
      throw new Error(`[${service.name}] exited before becoming healthy`);
    }

    if (await areHealthChecksReachable(service.healthChecks)) {
      return;
    }

    const elapsedMs = Date.now() - start;
    if (elapsedMs - lastProgressAt >= PROGRESS_LOG_INTERVAL_MS) {
      lastProgressAt = elapsedMs;
      console.log(
        `[${service.name}] waiting... ${Math.floor(elapsedMs / 1000)}s elapsed (timeout ${TIMEOUT_MS / 1000}s)`,
      );
    }

    await sleep(POLL_MS);
  }

  throw new Error(
    `[${service.name}] health check timeout after ${TIMEOUT_MS / 1000}s: ${flattenHealthChecks(service.healthChecks).join(', ')}`,
  );
}

async function assertPortIsFree(port, serviceName) {
  await new Promise((resolve, reject) => {
    const socket = new Socket();
    socket.setTimeout(1_500);

    socket.once('connect', () => {
      socket.destroy();
      reject(new Error(`[${serviceName}] required port ${port} is already in use`));
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve();
    });

    socket.once('error', (error) => {
      if (error && (error.code === 'ECONNREFUSED' || error.code === 'EHOSTUNREACH')) {
        resolve();
        return;
      }
      reject(new Error(`[${serviceName}] failed to probe port ${port}: ${error.code ?? error.message}`));
    });

    socket.connect(port, '127.0.0.1');
  });
}

async function ensurePortIsFree(port, serviceName) {
  try {
    await assertPortIsFree(port, serviceName);
    return;
  } catch {
    const released = tryReleasePort(port);
    if (released) {
      await sleep(500);
      await assertPortIsFree(port, serviceName);
      console.log(`[${serviceName}] released stale process on port ${port}`);
      return;
    }
    throw new Error(`[${serviceName}] required port ${port} is already in use`);
  }
}

async function isPortFree(port) {
  try {
    await new Promise((resolve, reject) => {
      const socket = new Socket();
      socket.setTimeout(1_500);

      socket.once('connect', () => {
        socket.destroy();
        reject(new Error('in use'));
      });

      socket.once('timeout', () => {
        socket.destroy();
        resolve();
      });

      socket.once('error', (error) => {
        if (error && (error.code === 'ECONNREFUSED' || error.code === 'EHOSTUNREACH')) {
          resolve();
          return;
        }
        reject(error);
      });

      socket.connect(port, '127.0.0.1');
    });
    return true;
  } catch {
    return false;
  }
}

async function areHealthChecksReachable(healthChecks) {
  for (const urls of healthChecks) {
    let reachable = false;
    for (const url of urls) {
      try {
        const response = await fetch(url, { redirect: 'manual' });
        if (isHealthyStatus(response.status)) {
          reachable = true;
          break;
        }
      } catch {
        // try next fallback URL
      }
    }
    if (!reachable) {
      return false;
    }
  }
  return true;
}

function isHealthyStatus(status) {
  return status >= 200 && status < 400;
}

function flattenHealthChecks(healthChecks) {
  return healthChecks.flat();
}

function tryReleasePort(port) {
  if (process.platform === 'win32') {
    const netstat = spawnSync('netstat', ['-ano'], { encoding: 'utf8' });
    if (netstat.status !== 0 || !netstat.stdout) {
      return false;
    }

    const pids = new Set();
    for (const line of netstat.stdout.split(/\r?\n/)) {
      if (!line.includes(`:${port}`)) {
        continue;
      }
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid)) {
        pids.add(pid);
      }
    }

    let killedAny = false;
    for (const pid of pids) {
      const result = spawnSync('taskkill', ['/pid', String(pid), '/t', '/f'], { stdio: 'ignore' });
      if (result.status === 0) {
        killedAny = true;
      }
    }
    return killedAny;
  }

  const lsof = spawnSync('lsof', ['-ti', `tcp:${port}`], { encoding: 'utf8' });
  if (lsof.status !== 0 || !lsof.stdout) {
    return false;
  }

  const pids = lsof.stdout
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);

  let killedAny = false;
  for (const pid of pids) {
    const killResult = spawnSync('kill', ['-9', pid], { stdio: 'ignore' });
    if (killResult.status === 0) {
      killedAny = true;
    }
  }
  return killedAny;
}

async function stopChild(child) {
  if (!child || child.exitCode !== null || child.signalCode != null) {
    return;
  }

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
  } else {
    child.kill('SIGTERM');
    const exited = await Promise.race([
      new Promise((resolve) => child.once('exit', () => resolve(true))),
      sleep(8_000).then(() => false),
    ]);
    if (!exited) {
      child.kill('SIGKILL');
    }
  }
}

async function stopAllChildren() {
  const children = [...runningChildren];
  await Promise.all(children.map((child) => stopChild(child)));
}

function appendLog(buffer, chunk) {
  const lines = chunk.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    buffer.push(line);
    if (buffer.length > LOG_TAIL_LINES) {
      buffer.shift();
    }
  }
}

function printLogTail(serviceName, buffer) {
  console.error(`\n[${serviceName}] Recent logs:`);
  if (buffer.length === 0) {
    console.error('(no logs captured)');
    return;
  }
  for (const line of buffer) {
    console.error(line);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(`Health check failed: ${error.message}`);
    await stopAllChildren();
    process.exit(1);
  });
