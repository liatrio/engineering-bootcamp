import type { Employee } from '../features/employees/types';
import type { Project } from '../features/projects/types';

// The seed rows from SPEC.md, so tests read like the running app.
const stamp = { createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' };

export const ada: Employee = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  title: 'Principal Engineer',
  department: 'Engineering',
  ...stamp,
};

export const grace: Employee = {
  id: '22222222-2222-4222-8222-222222222222',
  name: 'Grace Hopper',
  email: 'grace@example.com',
  title: 'Engineering Manager',
  department: 'Engineering',
  ...stamp,
};

export const platform: Project = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  name: 'Platform Modernization',
  description: 'Move the monolith to services.',
  startDate: '2026-01-05',
  status: 'active',
  ...stamp,
};

export const portal: Project = {
  id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  name: 'Customer Portal',
  description: '',
  startDate: '2026-03-02',
  status: 'planned',
  ...stamp,
};
