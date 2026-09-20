import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {

    // Welcome & Main
    readonly welcomeMessage: Locator;
    readonly mainContent: Locator;

    // Financial Summary Cards
    readonly totalNetWorth: Locator;
    readonly netChange: Locator;
    readonly income: Locator;
    readonly expenses: Locator;

    // Quick Actions
    readonly quickTransfer: Locator;
    readonly quickSendMoney: Locator;
    readonly quickBillPay: Locator;
    readonly quickApplyLoan: Locator;
    readonly quickTransactions: Locator;

    // Transactions Table
    readonly viewAllTransactions: Locator;
    readonly transactionRows: Locator;

    constructor(page: Page) {
        super(page);

        // Welcome & Main
        this.welcomeMessage = page.getByTestId('dashboard-welcome-message');
        this.mainContent = page.getByTestId('bank-main-content');

        // Financial Summary Cards
        this.totalNetWorth = page.getByText('Total Net Worth').locator('../..');
        this.netChange = page.getByText('Net Change').locator('../..');
        this.income = page.getByText('Income').locator('../..');
        this.expenses = page.getByText('Expenses').locator('../..');

        // Quick Actions
        this.quickTransfer = page.getByTestId('quick-action-transfer');
        this.quickSendMoney = page.getByTestId('quick-action-send-money');
        this.quickBillPay = page.getByTestId('quick-action-bill-pay');
        this.quickApplyLoan = page.getByTestId('quick-action-apply-loan');
        this.quickTransactions = page.getByTestId('quick-action-transactions');

        // Transactions Table
        this.viewAllTransactions = page.getByTestId('view-all-transactions-btn');
        this.transactionRows = page.locator('table tbody tr');
    }

    // Navigate to dashboard
    async goto(): Promise<void> {
        await this.navigate('dashboard');
    }

    // Get welcome text
    async getWelcomeText(): Promise<string> {
        return await this.getLocatorText(this.welcomeMessage);
    }

    // Get total net worth amount
    async getNetWorth(): Promise<string> {
        const cardText = await this.getLocatorText(this.totalNetWorth);
        const match = cardText.match(/\$[\d,]+\.\d{2}/);
        return match ? match[0] : '';
    }

    // Get transaction count
    async getTransactionCount(): Promise<number> {
        return await this.transactionRows.count();
    }

    // Get transaction details by row index
    async getTransactionByIndex(index: number): Promise<{
        date: string;
        description: string;
        category: string;
        amount: string;
    }> {
        const row = this.transactionRows.nth(index);
        return {
            date: await row.locator('td').nth(0).textContent() ?? '',
            description: await row.locator('td').nth(1).textContent() ?? '',
            category: await row.locator('td').nth(2).textContent() ?? '',
            amount: await row.locator('td').nth(3).textContent() ?? '',
        };
    }

    // Check if dashboard loaded
    async isDashboardLoaded(): Promise<boolean> {
        return await this.welcomeMessage.isVisible();
    }
}