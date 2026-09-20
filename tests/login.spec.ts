import { test, expect } from '../fixtures/test-fixtures';
import { Logger } from '../helpers/logger';

const log = Logger.getInstance();

const loginScenarios = [
    { username: 'standard_user',  password: 'bank_sauce',  shouldLogin: true,  description: 'full access' },
    { username: 'locked_user',    password: 'bank_sauce',  shouldLogin: false, description: 'locked account' },
    { username: 'frozen_user',    password: 'bank_sauce',  shouldLogin: true,  description: 'frozen no transfers' },
    { username: 'overdraft_user', password: 'bank_sauce',  shouldLogin: true,  description: 'negative balance' },
    { username: 'slow_user',      password: 'bank_sauce',  shouldLogin: true,  description: 'slow loading' },
    { username: 'error_user',     password: 'bank_sauce',  shouldLogin: true,  description: 'wrong loan total' },
    { username: 'admin_user',     password: 'admin_sauce', shouldLogin: true,  description: 'admin view' },
];

test.describe('Login — All User Types', () => {

    for (const scenario of loginScenarios) {

        test(`login as ${scenario.username} — ${scenario.description} @login`, async ({ loginPage, page }) => {
            log.step(`Attempting login: ${scenario.username}`);

            await loginPage.login(scenario.username, scenario.password);

            if (scenario.shouldLogin) {
                await expect(page.getByTestId('dashboard-welcome-message'))
                    .toBeVisible({ timeout: 15000 });
                log.success(`${scenario.username} logged in successfully`);
            } else {
                await expect(loginPage.usernameField).toBeVisible();
                log.success(`${scenario.username} correctly blocked`);
            }
        });
    }
});

test.describe('Login — Negative Cases @negative', () => {

    test('wrong password shows error', async ({ loginPage, page }) => {
        await loginPage.login('standard_user', 'wrong_password');
        await expect(loginPage.usernameField).toBeVisible();
        log.success('Wrong password correctly rejected');
    });

    test('empty credentials blocked', async ({ loginPage }) => {
        await loginPage.loginButton.click();
        await expect(loginPage.usernameField).toBeVisible();
        log.success('Empty credentials correctly blocked');
    });

    test('non-existent user blocked', async ({ loginPage }) => {
        await loginPage.login('fake_user_12345', 'fake_pass');
        await expect(loginPage.usernameField).toBeVisible();
        log.success('Non-existent user correctly blocked');
    });
});