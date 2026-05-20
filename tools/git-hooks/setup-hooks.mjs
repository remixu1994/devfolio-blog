import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

try {
  execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: repoRoot,
    stdio: 'ignore',
  });
} catch {
  console.warn('[setup:hooks] Not inside a git repository. Skipping hook setup.');
  process.exit(0);
}

execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], {
  cwd: repoRoot,
  stdio: 'inherit',
});

console.log('[setup:hooks] Git hooks path set to .githooks');
