import { Controller, Get, Query, ServiceUnavailableException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  getGithubAuthorizationUrl() {
    const authorizationUrl = this.authService.getGithubAuthorizationUrl();

    if (!authorizationUrl) {
      throw new ServiceUnavailableException({
        configured: false,
        message: 'GitHub OAuth env vars are missing. Set GITHUB_CLIENT_ID and GITHUB_CALLBACK_URL.',
      });
    }

    return {
      configured: true,
      authorizationUrl,
      allowedLogin: this.authService.getAllowedLogin(),
    };
  }

  @Get('github/callback')
  handleGithubCallback(@Query('code') code?: string, @Query('state') state?: string) {
    return this.authService.handleGithubCallback(code, state);
  }
}
