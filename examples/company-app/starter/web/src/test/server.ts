import { setupServer } from 'msw/node';

/** One MSW server for all component tests. Each test adds the handlers it needs. */
export const server = setupServer();
