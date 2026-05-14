import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import http from 'node:http';

const [, , rootArg, portArg = '4200', fallbackArg] = process.argv;

if (!rootArg) {
  throw new Error('Usage: node tools/static-preview-server.mjs <root> [port] [fallback]');
}

const root = normalize(rootArg);
const port = Number(portArg);
const fallbackCandidates = [fallbackArg, 'index.html', 'index.csr.html'].filter(Boolean);
const fallbackFile = fallbackCandidates
  .map((candidate) => join(root, candidate))
  .find((candidatePath) => existsSync(candidatePath));

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function sendFile(filePath, response) {
  const extension = extname(filePath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(filePath).pipe(response);
}

http
  .createServer((request, response) => {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const requestedPath = decodeURIComponent(url.pathname);
    const normalizedPath = requestedPath === '/' ? '' : requestedPath.replace(/^\/+/, '');
    const absolutePath = join(root, normalizedPath);

    if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
      sendFile(absolutePath, response);
      return;
    }

    if (!extname(requestedPath) && fallbackFile) {
      sendFile(fallbackFile, response);
      return;
    }

    response.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    response.end('Not found');
  })
  .listen(port, '0.0.0.0', () => {
    console.log(`Static preview listening on http://localhost:${port}`);
  });
