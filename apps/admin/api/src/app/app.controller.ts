import { Controller, Get, HttpCode, HttpStatus, Redirect, ServiceUnavailableException } from '@nestjs/common';
import { existsSync } from 'node:fs';
import path from 'node:path';

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
    const adminDistPath = path.join(process.cwd(), 'dist', 'admin', 'admin');
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
