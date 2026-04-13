import { type Locator, type Page } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResultsContainer: Locator;
  readonly acceptCookiesButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('combobox', { name: 'Najít' })
    this.searchButton = page.getByRole('button', { name: 'Hledat Googlem' }).first();
    this.searchResultsContainer = page.locator('#search');
    this.acceptCookiesButton = page.getByRole('button', { name: 'Přijmout vše' });
  }

  async open(): Promise<void> {
    await this.page.goto(`${process.env.BASE_URL}`);
  }

  getSearchResultByText(text: string): { searchResultContainer: Locator; searchResultLink: Locator; searchResultHeader: Locator } {
    const searchResultContainer = this.searchResultsContainer.locator('span').filter({ hasText: text });
    const searchResultLink = searchResultContainer.getByRole('link');
    const searchResultHeader = searchResultContainer.getByRole('heading');
    return { searchResultContainer, searchResultLink, searchResultHeader };
  }

  async acceptCookies(): Promise<void> {
    if (await this.acceptCookiesButton.isVisible()) {
      await this.acceptCookiesButton.click();
    }
  }

  async searchByText(text: string): Promise<void> {
    await this.searchInput.fill(text);
    await this.searchButton.click({force: true});
  }
};
