import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransactionsPage extends BasePage {
  readonly searchInput: Locator;
  readonly rows: Locator;
  readonly paginationInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('all-txn-search-input');
    this.rows = page.getByTestId('all-txn-row');
    this.paginationInfo = page.getByTestId('all-txn-pagination-info');
  }

  async goto(): Promise<void> {
    await this.navigate('transactions');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }
}
