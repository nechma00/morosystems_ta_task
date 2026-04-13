import { ApiClient } from './apiClient.service';
import { endpoints } from './endpoints';
import { CreateTask, UpdateTask } from './types/types';

export class TasksService {
  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async getAllTasks() {
    return this.client.get(endpoints.tasks.all);
  }

  async getCompletedTasks() {
    return this.client.get(endpoints.tasks.completed);
  }

  async createTask(payload: CreateTask) {
    return this.client.post(endpoints.tasks.all, payload);
  }

  async updateTask(id: string, payload: UpdateTask) {
    return this.client.post(endpoints.tasks.byId(id), payload);
  }

  async deleteTask(id: string) {
    return this.client.delete(endpoints.tasks.byId(id));
  }

  async completeTask(id: string) {
    return this.client.post(endpoints.tasks.complete(id), {});
  }

  async incompleteTask(id: string) {
    return this.client.post(endpoints.tasks.incomplete(id), {});
  }
}
