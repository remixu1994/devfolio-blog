import { Socket } from 'node:net';
import { readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const TIMEOUT_MS = 90_000;
const POLL_MS = 1_000;
const LOG_TAIL_LINES = 120;

const services = [
  { name: 'api', port: 3000, url: 'http://127.0.0.1:3000/api', commandArgs: ['.nx/nxw.js', 'serve', 'api'] },
  { name: 'site', port: 4200, url: 'http://127.0.0.1:4200/zh', commandArgs: ['.nx/nxw.js', 'serve', 'site'] },
  { name: 'admin', port: 4300, url: 'http://127.0.0.1:4300/', commandArgs: ['.nx/nxw.js', 'serve', 'admin'] },
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
    await assertPortIsFree(service.port, service.name);
    await verifyServiceStartup(service);
  }

  console.log('All service startup checks passed.');
}

async function assertProjectConfig() {
  const siteProject = JSON.parse(await readFile(path.join(ROOT, 'site', 'project.json'), 'utf8'));
  const adminProject = JSON.parse(await readFile(path.join(ROOT, 'admin', 'project.json'), 'utf8'));

  const siteAllowedHosts = siteProject?.targets?.serve?.options?.allowedHosts;
  const hasLocalhost = Array.isArray(siteAllowedHosts) && siteAllowedHosts.includes('localhost');
  const hasLoopback = Array.isArray(siteAllowedHosts) && siteAllowedHosts.includes('127.0.0.1');

  if (!hasLocalhost || !hasLoopback) {
    throw new Error(
      `site serve allowedHosts must include localhost and 127.0.0.1; current value: ${JSON.stringify(siteAllowedHosts)}`,
    );
  }

  const adminPort = adminProject?.targets?.serve?.options?.port;
  if (adminPort !== 4300) {
    throw new Error(`admin serve port must be 4300; current value: ${JSON.stringify(adminPort)}`);
  }
}

async function verifyServiceStartup(service) {
  const logBuffer = [];
  console.log(`\n[${service.name}] Starting...`);

  const child = spawn(process.execPath, service.commandArgs, {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
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
    console.log(`[${service.name}] Healthy at ${service.url}`);
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

  while (Date.now() - start <= TIMEOUT_MS) {
    const exited = await Promise.race([
      exitPromise,
      new Promise((resolve) => setTimeout(() => resolve(null), 0)),
    ]);

    if (exited) {
      throw new Error(`[${service.name}] exited before becoming healthy`);
    }

    try {
      const response = await fetch(service.url, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 300) {
        return;
      }
    } catch {
      // Service may still be booting.
    }

    await sleep(POLL_MS);
  }

  throw new Error(`[${service.name}] health check timeout after ${TIMEOUT_MS / 1000}s: ${service.url}`);
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

async function stopChild(child) {
  if (!child || child.killed) {
    return;
  }

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
  } else {
    child.kill('SIGTERM');
    await Promise.race([
      new Promise((resolve) => child.once('exit', resolve)),
      sleep(8_000),
    ]);
    if (!child.killed) {
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

main().catch(async (error) => {
  console.error(`Health check failed: ${error.message}`);
  await stopAllChildren();
  process.exit(1);
});
