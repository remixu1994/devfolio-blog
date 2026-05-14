import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getAllowedLogin(): string | null {
    return process.env.GITHUB_ALLOWED_LOGIN ?? null;
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
    url.searchParams.set('state', 'devfolio-admin');

    return url.toString();
  }

  handleGithubCallback(code?: string, state?: string) {
    return {
      configured: Boolean(this.getGithubAuthorizationUrl()),
      receivedCode: Boolean(code),
      state: state ?? null,
      allowedLogin: this.getAllowedLogin(),
      note: 'OAuth callback wiring is in place. Exchange the code for a token and validate the login before enabling production access.',
    };
  }
}
