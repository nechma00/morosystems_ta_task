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

const viewports = [
    { name: 'mobile', size: { width: 390, height: 844 } },
    { name: 'tablet', size: { width: 820, height: 1180 } },
    { name: 'laptop', size: { width: 1600, height: 1200 } },
];

for (const viewport of viewports) {
    test(`@visual should validate visuals and styling on ${viewport.name} - ${viewport.size.width}x${viewport.size.height}`, async ({ morosystemsPage }) => {
        await test.step('navigate to Morosystems website', async () => {
            await morosystemsPage.page.setViewportSize(viewport.size);
            await morosystemsPage.open();
            await morosystemsPage.selectLanguage('cz');
            await morosystemsPage.acceptCookies();
        });

        await test.step(`assert homepage visuals on ${viewport.name}`, async () => {
            await morosystemsPage.page.waitForTimeout(2000);
            await expect(morosystemsPage.page).toHaveScreenshot(`morosystems-homepage-${viewport.name}.png`, {
                fullPage: true,
                animations: 'disabled',
                caret: 'hide',
                mask: [morosystemsPage.cookiesModal],
                maxDiffPixelRatio: 0.05,
            });
        });

        await test.step(`assert kariera page visuals on ${viewport.name}`, async () => {
            await morosystemsPage.navigateToKariera();
            await morosystemsPage.page.waitForTimeout(2000);

            await expect(morosystemsPage.page).toHaveScreenshot(`morosystems-kariera-${viewport.name}.png`, {
                fullPage: true,
                animations: 'disabled',
                caret: 'hide',
                mask: [morosystemsPage.cookiesModal],
                maxDiffPixelRatio: 0.05, // increase tolerance for dynamic content

            });
        });
    });
}