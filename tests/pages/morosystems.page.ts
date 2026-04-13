import { type Locator, type Page } from '@playwright/test';

export class MorosystemsPage {
  // Locators
  readonly page: Page;
  readonly karieraLink: Locator;
  readonly languageSelector: Locator;
  readonly locationDropdown: Locator;
  readonly positionRow: Locator;
  readonly openPositionsHeading: Locator;
  readonly cookiesModal: Locator;
  readonly acceptCookiesButton: Locator;
  readonly menuButton: Locator;
  // Constants
  readonly url: string;
  readonly karieraUrl: string;

  constructor(page: Page) {
    // Initialize locators and constants
    this.page = page;
    this.karieraLink = page.getByRole('link', { name: 'Kariéra' }).first(); // depending on resolution, there might be main menu and footer link at the same time
    this.languageSelector = page.getByRole('link', { name: 'en Show more languages' });
    this.locationDropdown = page.getByRole('link', { name: 'Všechna města' });
    this.positionRow = page.locator('[data-event-category="Pozice"]');
    this.openPositionsHeading = page.locator("#pozice").getByRole('heading');
    this.cookiesModal = page.locator('#cookiescript_injected');
    this.acceptCookiesButton = page.getByRole('button', { name: 'Přijmout vše' });
    this.menuButton = page.getByLabel("Menu");
    // constants values
    this.url = 'https://www.morosystems.com/';
    this.karieraUrl = "https://www.morosystems.cz/kariera/";
  }

  async open(): Promise<void> {
    await this.page.goto(this.url);
    await this.selectLanguage('cz');
    await this.acceptCookies();
  };

  async navigateToKariera(): Promise<void> {
    await this.page.goto(this.karieraUrl);
  };

  async selectLocation(location: string): Promise<void> {
    await this.locationDropdown.click();
    const locationOption = this.page.locator('label').filter({ hasText: location });
    await locationOption.click();
  };

    async selectLanguage(language: string): Promise<void> {
    await this.languageSelector.click();
    const languageOption = this.page.getByRole('link', { name: language, exact: true });
    await languageOption.click();
  };

  async acceptCookies(): Promise<void> {
    await this.acceptCookiesButton.click();
  };

  getPositionByTitle(title: string): Locator {
    return this.page.getByRole('link', { name: title });
  };
}
