import { Controller, Get, HttpCode, HttpStatus, Redirect, ServiceUnavailableException } from '@nestjs/common';
import { existsSync } from 'node:fs';
import path from 'node:path';

function resolveAdminDistPath() {
  const runtimeEntryPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
  const runtimeDir = runtimeEntryPath ? path.dirname(runtimeEntryPath) : null;
  const runtimeCandidates = runtimeDir
    ? [path.join(runtimeDir, 'admin'), path.resolve(runtimeDir, '..', 'admin'), path.resolve(runtimeDir, '..', '..', 'admin')]
    : [];

  for (const candidate of runtimeCandidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return path.join(process.cwd(), 'dist', 'admin', 'admin');
}

@Controller()
export class AppController {
  @Get()
  @Redirect('/api/docs', 302)
  redirectToDocs() {
    return;
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health() {
    const adminDistPath = resolveAdminDistPath();
    const adminIndexPath = path.join(adminDistPath, 'index.html');
    const adminDistExists = existsSync(adminDistPath);
    const adminIndexExists = existsSync(adminIndexPath);
    const isHealthy = adminDistExists && adminIndexExists;

    const payload = {
      status: isHealthy ? 'ok' : 'error',
      checks: {
        adminUi: {
          status: isHealthy ? 'ok' : 'error',
          distPath: adminDistPath,
          distExists: adminDistExists,
          indexPath: adminIndexPath,
          indexExists: adminIndexExists,
        },
      },
    };

    if (!isHealthy) {
      throw new ServiceUnavailableException(payload);
    }

    return payload;
  }
}
