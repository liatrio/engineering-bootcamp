import type { RouteObject } from 'react-router';
import { AssignmentsPage } from './AssignmentsPage';
import { NewAssignmentPage } from './AssignmentForm';

export const assignmentRoutes: RouteObject[] = [
  { path: 'assignments', element: <AssignmentsPage /> },
  { path: 'assignments/new', element: <NewAssignmentPage /> },
];
