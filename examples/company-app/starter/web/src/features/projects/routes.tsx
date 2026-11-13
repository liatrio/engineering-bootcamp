import type { RouteObject } from 'react-router';
import { ProjectsPage } from './ProjectsPage';
import { EditProjectPage, NewProjectPage } from './ProjectForm';

export const projectRoutes: RouteObject[] = [
  { path: 'projects', element: <ProjectsPage /> },
  { path: 'projects/new', element: <NewProjectPage /> },
  { path: 'projects/:id/edit', element: <EditProjectPage /> },
];
