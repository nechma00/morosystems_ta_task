import { test as base } from '@playwright/test';
import { SearchPage } from '../pages/search.page';
import { MorosystemsPage } from '../pages/morosystems.page';
import { ApiClient } from '../services/apiClient.service';
import { TasksService } from '../services/tasks.service';

type Fixtures = {
  searchPage: SearchPage;
  morosystemsPage: MorosystemsPage;
  apiClient: ApiClient;
  tasksService: TasksService;
};

export const test = base.extend<Fixtures>({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },
    morosystemsPage: async ({ page }, use) => {
    const morosystemsPage = new MorosystemsPage(page);
    await use(morosystemsPage);
  },

  // eslint-disable-next-line no-empty-pattern
  apiClient: async ({}, use, testInfo) => {
    const apiClient = await ApiClient.create();
    await use(apiClient);
    const logs = apiClient.getLogs();
    if (logs.length > 0) {
      await testInfo.attach('api-logs', {
        body: logs.join('\n'),
        contentType: 'text/plain',
      });
    }
    await apiClient.dispose();
  },
  tasksService: async ({ apiClient }, use) => {
    const tasksService = new TasksService(apiClient);
    await use(tasksService);
  },
});

export { expect } from '@playwright/test';
