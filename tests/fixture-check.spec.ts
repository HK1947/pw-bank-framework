import { test, expect } from '../fixtures/test-fixtures';
//                          ^^^^^^^^^^^^^^^^^^^^^^^^^^
//   OUR fixtures file, NOT @playwright/test!

test('loginPage fixture — on login screen', async ({ loginPage }) => {
    // Already navigated! Just verify.
    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
});

test('dashboardPage fixture — already logged in', async ({ dashboardPage }) => {
    // Already logged in! Just verify.
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    
    const netWorth = await dashboardPage.getNetWorth();
    console.log(`Net Worth: ${netWorth}`);
    expect(netWorth).toContain('$');
});

test('apiClient fixture — already authenticated', async ({ apiClient }) => {
    // Token already fetched! Just use it.
    const booking = await apiClient.createBooking({
        firstname: 'Fixture',
        lastname: 'Test',
        totalprice: 100,
        depositpaid: true,
        bookingdates: { checkin: '2026-09-15', checkout: '2026-09-16' }
    });
    expect(booking.bookingid).toBeTruthy();
    
    await apiClient.deleteBooking(booking.bookingid);
});

