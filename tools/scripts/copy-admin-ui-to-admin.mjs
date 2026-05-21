import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const root = path.resolve(currentDir, '..', '..');
const sourceDir = path.join(root, 'dist', 'admin-ui', 'browser');
const targetDir = path.join(root, 'dist', 'admin', 'admin');

async function copyAdminAssets() {
  try {
    const sourceStat = await stat(sourceDir);
    if (!sourceStat.isDirectory()) {
      throw new Error(`Admin build output is not a directory: ${sourceDir}`);
    }
  } catch (error) {
    throw new Error(`Admin UI build output missing at ${sourceDir}. Run admin:ui-build before admin:build.`);
  }

  await mkdir(path.dirname(targetDir), { recursive: true });
  await rm(targetDir, { recursive: true, force: true });
  await cp(sourceDir, targetDir, { recursive: true });
}

copyAdminAssets().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
