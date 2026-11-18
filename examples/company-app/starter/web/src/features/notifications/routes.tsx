import type { RouteObject } from 'react-router';
import { NotificationsPage } from './NotificationsPage';

export const notificationRoutes: RouteObject[] = [
  { path: 'notifications', element: <NotificationsPage /> },
];
