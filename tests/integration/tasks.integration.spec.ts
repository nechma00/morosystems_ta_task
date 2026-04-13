import { expect, test } from '../fixtures/base.fixture';
import { type TasksService } from '../services/tasks.service';

test('should get existing tasks', async ({ tasksService }) => {
    let allTasks: Awaited<ReturnType<TasksService['getAllTasks']>>;

    await test.step('send request to get all tasks', async () => {
        allTasks = await tasksService.getAllTasks();
    });

    await test.step('validate tasks were returned successfully', async () => {
        expect(allTasks.length).toBeGreaterThanOrEqual(3);
    });
});

test('should get and validate completed task', async ({ tasksService }) => {
    let completedTasks: Awaited<ReturnType<TasksService['getCompletedTasks']>>;

    await test.step('send request to get completed tasks', async () => {
        completedTasks = await tasksService.getCompletedTasks();
    });

    await test.step('validate completed tasks were returned successfully', async () => {
        expect(completedTasks.length).toBeGreaterThanOrEqual(1);
        completedTasks.forEach(task => {
            expect(task.completed).toBe(true);
            expect(task.completedDate).toBeDefined();
        });
    });
});

test('should create a new task and verify it appears in all tasks', async ({ tasksService }) => {
    const taskText = `Test task ${Date.now()}`;
    let createdTask: Awaited<ReturnType<TasksService['createTask']>>;
    let allTasks: Awaited<ReturnType<TasksService['getAllTasks']>>;

    await test.step('create a new task', async () => {
        createdTask = await tasksService.createTask({ text: taskText });
    });

    await test.step('validate created task is returned with correct properties', async () => {
        expect(createdTask.text).toBe(taskText);
        expect(createdTask.id).toBeDefined();
        expect(createdTask.completed).toBe(false);
        expect(createdTask.createdDate).toBeDefined();
    });

    await test.step('retrieve all tasks', async () => {
        allTasks = await tasksService.getAllTasks();
    });

    await test.step('validate all tasks list contains the newly created task', async () => {
        const match = allTasks.find((task) => task.id === createdTask.id);
        expect(match).toBeDefined();
        expect(match!.text).toBe(taskText);
    });

    await test.step('cleanup - delete the created task', async () => {
        await tasksService.deleteTask(createdTask.id);
    });
});

test('should create a new task and update its text', async ({ tasksService }) => {
    const initialText = `Initial task ${Date.now()}`;
    const updatedText = `Updated task ${Date.now()}`;
    let createdTask: Awaited<ReturnType<TasksService['createTask']>>;
    let updatedTask: Awaited<ReturnType<TasksService['updateTask']>>;

    await test.step('create a new task with random text', async () => {
        createdTask = await tasksService.createTask({ text: initialText });
    });

    await test.step('validate created task has the initial text', async () => {
        expect(createdTask.id).toBeDefined();
        expect(createdTask.text).toBe(initialText);
    });

    await test.step('update the text of the created task', async () => {
        updatedTask = await tasksService.updateTask(createdTask.id, { text: updatedText });
    });

    await test.step('validate task text was updated successfully', async () => {
        expect(updatedTask.id).toBe(createdTask.id);
        expect(updatedTask.text).toBe(updatedText);
    });

    await test.step('cleanup - delete the created task', async () => {
        await tasksService.deleteTask(createdTask.id);
    });
});

test('should manage task status', async ({ tasksService }) => {
    const taskText = `Toggle task ${Date.now()}`;
    let createdTask: Awaited<ReturnType<TasksService['createTask']>>;
    let completedTask: Awaited<ReturnType<TasksService['completeTask']>>;
    let incompletedTask: Awaited<ReturnType<TasksService['incompleteTask']>>;

    await test.step('create a new task with random text', async () => {
        createdTask = await tasksService.createTask({ text: taskText });
    });

    await test.step('validate created task is not completed', async () => {
        expect(createdTask.id).toBeDefined();
        expect(createdTask.completed).toBe(false);
        expect(createdTask.completedDate).toBeUndefined();
    });

    await test.step('complete the task', async () => {
        completedTask = await tasksService.completeTask(createdTask.id);
    });

    await test.step('validate task was completed successfully', async () => {
        expect(completedTask.id).toBe(createdTask.id);
        expect(completedTask.completed).toBe(true);
        expect(completedTask.completedDate).toBeDefined();
    });

    await test.step('incomplete the task', async () => {
        incompletedTask = await tasksService.incompleteTask(createdTask.id);
    });

    await test.step('validate task was incompleted successfully', async () => {
        expect(incompletedTask.id).toBe(createdTask.id);
        expect(incompletedTask.completed).toBe(false);
        expect(incompletedTask.completedDate).toBeUndefined();
    });

    await test.step('cleanup - delete the created task', async () => {
        await tasksService.deleteTask(createdTask.id);
    });
});

