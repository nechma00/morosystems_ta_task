import { test, expect } from '../fixtures/base.fixture';
import { readFileSync } from 'fs';
import path from 'path';

test("should navigate to Morosystems website and filter open positions", async ({ searchPage, morosystemsPage }) => {
    let morosystemsResult: ReturnType<typeof searchPage.getSearchResultByText>;
    await test.step('open search engine and search for Morosystems', async () => {
        await searchPage.open();
        await searchPage.acceptCookies();
    });

    // The search will almost always trigger captcha, making it impossible to reliably check the search results
    // I selected the approach to mock the search results page with a static HTML file
    await test.step('mock response from google search and read static file', async () => {
        await searchPage.page.route("**google.com/search**", async (route) => {
            // Serve a static HTML file that mimics the Google search results page
            await route.fulfill({
                status: 200,
                contentType: "text/html",
                body: readFileSync(path.resolve(__dirname, '../fixtures/search_results.html'), 'utf8'),
            });
        });
        await searchPage.searchByText('MoroSystems');
        morosystemsResult = searchPage.getSearchResultByText('MoroSystems | AI-ready');
        await expect(morosystemsResult.searchResultHeader).toBeVisible();
        await expect(morosystemsResult.searchResultLink).toHaveAttribute('href', morosystemsPage.url);
    });

    await test.step('navigate to Morosystems website', async () => {
        await morosystemsResult.searchResultHeader.click();
    });

    await test.step('select czech language', async () => {
        await morosystemsPage.selectLanguage('cz');
        await morosystemsPage.acceptCookies();
    });
    await test.step('navigate to Kariera page', async () => {
        await morosystemsPage.karieraLink.click();
        await expect(morosystemsPage.openPositionsHeading).toContainText("Koho hledáme");
        await expect(morosystemsPage.positionRow.filter({ visible: true })).toHaveCount(6);
    });

    await test.step('filter open positions by location', async () => {
        await morosystemsPage.selectLocation('Praha');
        await expect(morosystemsPage.positionRow.filter({ visible: true })).toHaveCount(2);
        await expect(morosystemsPage.getPositionByTitle('Atlassian Solution Architekt')).toBeVisible();
        await expect(morosystemsPage.getPositionByTitle('Full Stack Developer – nové projekty, Hradec Králové / Brno / Praha')).toBeVisible();
    });
});

test("should navigate to Morosystems website and validate visuals and styling", async ({ morosystemsPage }) => {
    await test.step('navigate to Morosystems website', async () => {
        await morosystemsPage.open();
    });

    await test.step('switch language to czech', async () => {
        await morosystemsPage.selectLanguage('cz');
        await morosystemsPage.acceptCookies();
    });

    await test.step('assert fully loaded home page with visual baseline comparison', async () => {
        // Use a viewport to capture the whole page in the screenshot and ensure consistent rendering
        await morosystemsPage.page.setViewportSize({ width: 1920, height: 1080 });
        await morosystemsPage.page.waitForTimeout(2000); // Wait for dynamic content to load

        await expect(morosystemsPage.page).toHaveScreenshot('morosystems-homepage.png', {
            fullPage: true,
            animations: 'disabled',
            caret: 'hide',
        });
    });

    await test.step('navigate to Kariera page and assert visuals', async () => {
        await morosystemsPage.karieraLink.click();
        await morosystemsPage.page.waitForTimeout(2000); // Wait for dynamic content to load

        await expect(morosystemsPage.page).toHaveScreenshot('morosystems-kariera.png', {
            fullPage: true,
            animations: 'disabled',
            caret: 'hide',
        });
    });
});