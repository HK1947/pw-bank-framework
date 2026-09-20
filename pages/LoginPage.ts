import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly passwordEyeIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.getByTestId('login-username-input');
    this.passwordField = page.getByTestId('login-password-input');
    this.loginButton = page.getByTestId('login-submit-btn');
    this.rememberMeCheckbox = page.getByLabel('Remember me');
    this.forgotPasswordLink = page.getByText('Forgot password?');
    this.errorMessage = page.getByTestId('login-error-message');
    this.passwordEyeIcon = page.getByRole('button', { name: /toggle password visibility/i });
  }

  async goto(): Promise<void> {
    await this.navigate('login');
    await this.usernameField.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async loginWithRememberMe(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.rememberMeCheckbox.check();
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string> {
    return this.getLocatorText(this.errorMessage);
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordEyeIcon.click();
  }
}
