import { Navigate, type RouteObject } from 'react-router';
import { assignmentRoutes } from '../features/assignments/routes';
import { employeeRoutes } from '../features/employees/routes';
import { notificationRoutes } from '../features/notifications/routes';
import { projectRoutes } from '../features/projects/routes';
import { RootLayout } from './RootLayout';
import { RouteError } from './RouteError';

/** The one route table. Each feature exports its routes; adding a feature is one spread. */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/employees" replace /> },
      ...employeeRoutes,
      ...projectRoutes,
      ...assignmentRoutes,
      ...notificationRoutes,
    ],
  },
];
