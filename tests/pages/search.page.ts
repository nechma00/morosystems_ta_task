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
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error('Missing BASE_URL environment variable required by SearchPage.open().');
    }

    await this.page.goto(baseUrl);
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
