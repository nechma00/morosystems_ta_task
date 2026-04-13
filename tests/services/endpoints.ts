export const endpoints = {
  health: '/health',
  users: '/users',
  tasks: {
    all: '/tasks',
    completed: '/tasks/completed',
    byId: (id: string) => `/tasks/${id}`,
    complete: (id: string) => `/tasks/${id}/complete`,
    incomplete: (id: string) => `/tasks/${id}/incomplete`,
  },
};
