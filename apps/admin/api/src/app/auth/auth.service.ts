import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private readonly oauthStates = new Map<string, number>();

  getAllowedLogin(): string | null {
    return process.env.GITHUB_ALLOWED_LOGIN ?? null;
  }

  private cleanupExpiredStates(now = Date.now()): void {
    for (const [state, expiresAt] of this.oauthStates.entries()) {
      if (expiresAt <= now) {
        this.oauthStates.delete(state);
      }
    }
  }

  private issueOauthState(): string {
    const state = randomUUID();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    this.oauthStates.set(state, expiresAt);
    this.cleanupExpiredStates();
    return state;
  }

  getGithubAuthorizationUrl(): string | null {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const callbackUrl = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !callbackUrl) {
      return null;
    }

    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', callbackUrl);
    url.searchParams.set('scope', 'read:user user:email');
    url.searchParams.set('state', this.issueOauthState());

    return url.toString();
  }

  handleGithubCallback(code?: string, state?: string) {
    if (!this.getGithubAuthorizationUrl()) {
      throw new ServiceUnavailableException('GitHub OAuth env vars are missing.');
    }

    if (!state) {
      throw new BadRequestException('Missing OAuth state.');
    }

    const expiresAt = this.oauthStates.get(state);
    this.oauthStates.delete(state);

    if (!expiresAt || expiresAt <= Date.now()) {
      throw new BadRequestException('Invalid or expired OAuth state.');
    }

    if (!code) {
      throw new BadRequestException('Missing OAuth code.');
    }

    return {
      configured: true,
      receivedCode: true,
      state,
      allowedLogin: this.getAllowedLogin(),
      note: 'OAuth callback wiring is in place. Exchange the code for a token and validate the login before enabling production access.',
    };
  }
}
