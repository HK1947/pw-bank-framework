import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface TransactionDetails {
  date: string;
  description: string;
  category: string;
  amount: string;
}

export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly mainContent: Locator;
  readonly totalNetWorth: Locator;
  readonly netChange: Locator;
  readonly income: Locator;
  readonly expenses: Locator;
  readonly quickTransfer: Locator;
  readonly quickSendMoney: Locator;
  readonly quickBillPay: Locator;
  readonly quickApplyLoan: Locator;
  readonly quickTransactions: Locator;
  readonly viewAllTransactions: Locator;
  readonly transactionRows: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByTestId('dashboard-welcome-message');
    this.mainContent = page.getByTestId('bank-main-content');
    this.totalNetWorth = page.getByText('Total Net Worth').locator('../..');
    this.netChange = page.getByText('Net Change').locator('../..');
    this.income = page.getByText('Income').locator('../..');
    this.expenses = page.getByText('Expenses').locator('../..');
    this.quickTransfer = page.getByTestId('quick-action-transfer');
    this.quickSendMoney = page.getByTestId('quick-action-send-money');
    this.quickBillPay = page.getByTestId('quick-action-bill-pay');
    this.quickApplyLoan = page.getByTestId('quick-action-apply-loan');
    this.quickTransactions = page.getByTestId('quick-action-transactions');
    this.viewAllTransactions = page.getByTestId('view-all-transactions-btn');
    this.transactionRows = page.locator('table tbody tr');
  }

  async goto(): Promise<void> {
    await this.navigate('dashboard');
    await this.welcomeMessage.waitFor({ state: 'visible' });
  }

  async getWelcomeText(): Promise<string> {
    return this.getLocatorText(this.welcomeMessage);
  }

  async getNetWorth(): Promise<string> {
    const match = (await this.getLocatorText(this.totalNetWorth)).match(/\$[\d,]+\.\d{2}/);
    return match?.[0] ?? '';
  }

  async getTransactionCount(): Promise<number> {
    return this.transactionRows.count();
  }

  findTransactionByDescription(description: string): Locator {
    return this.transactionRows.filter({ hasText: description });
  }

  async getAllTransactionDescriptions(): Promise<string[]> {
    return this.transactionRows.locator('td:nth-child(2)').allTextContents();
  }

  async getTransactionByIndex(index: number): Promise<TransactionDetails> {
    const cells = this.transactionRows.nth(index).locator('td');
    return {
      date: (await cells.nth(0).textContent())?.trim() ?? '',
      description: (await cells.nth(1).textContent())?.trim() ?? '',
      category: (await cells.nth(2).textContent())?.trim() ?? '',
      amount: (await cells.nth(3).textContent())?.trim() ?? '',
    };
  }
}
