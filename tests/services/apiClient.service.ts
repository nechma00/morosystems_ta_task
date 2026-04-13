import { type APIRequestContext, expect, request } from '@playwright/test';
import type { Task } from './types/types';

export class ApiClient {
  private readonly context: APIRequestContext;
  private readonly logs: string[] = [];

  constructor(context: APIRequestContext) {
    this.context = context;
  }

  static async create(url?: string): Promise<ApiClient> {
    const baseURL = url ?? process.env.API_URL;
    if (!baseURL) {
      throw new Error('Missing API_URL environment variable required by ApiClient.create().');
    }

    const context = await request.newContext({ baseURL });
    return new ApiClient(context);
  }

  getLogs(): string[] {
    return this.logs;
  }

  private log(message: string): void {
    this.logs.push(`[${new Date().toISOString()}] ${message}`);
  }

  private formatJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }

  private formatBodyText(value: string): string {
    try {
      return this.formatJson(JSON.parse(value));
    } catch {
      return value;
    }
  }

  async get(path: string) {
    return this.context.get(path).then(async (response) => {
        expect(response.status()).toBe(200);
        const res: Task[] = await response.json() as Task[];
        this.log(`GET ${path} -> ${response.status()} response=${this.formatJson(res)}`);
        return res;
      });
  }

  async post(path: string, data: unknown) {
    return this.context.post(path, { data }).then(async (response) => {
        expect(response.status()).toBe(200);
        const res: Task = await response.json() as Task;
        this.log(
          `POST ${path} payload=${this.formatJson(data)} -> ${response.status()} response=${this.formatJson(res)}`
        );
        return res;
      });
  }

  async delete(path: string) {
    return this.context.delete(path).then(async (response) => {
        if (response.status() !== 200) {
          const errorBody = await response
            .text()
            .catch(() => '<unable to read error body>');

          this.log(
            `DELETE ${path} -> ${response.status()} response=${this.formatBodyText(errorBody)}`
          );

          throw new Error(
            `DELETE ${path} failed with status ${response.status()}: ${errorBody}`
          );
        }

        expect(response.status()).toBe(200);
        const body = await response.text();
        this.log(
          `DELETE ${path} -> ${response.status()} response=${body ? this.formatBodyText(body) : '<empty>'}`
        );
        return;
      });
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }
}
