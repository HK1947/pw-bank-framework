import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../helpers/logger';

const log = Logger.getInstance();

test('LoginPage — standard login', async({page})=>{

   const loginPage= new LoginPage(page);
    await loginPage.goto();
   await loginPage.login('standard_user', 'bank_sauce');
    await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
   log.success('✅ LoginPage works! Logged in successfully.');

})

test('LoginPage — wrong credentials', async({page})=>{
    const loginPage= new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong_user', 'wrong_pass');

    // Should show error - use expect which auto-waits
    await expect(loginPage.errorMessage).toBeVisible();
    log.success('✅ LoginPage error handling works!');

})