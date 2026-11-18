import type { RouteObject } from 'react-router';
import { EmployeesPage } from './EmployeesPage';
import { EditEmployeePage, NewEmployeePage } from './EmployeeForm';

export const employeeRoutes: RouteObject[] = [
  { path: 'employees', element: <EmployeesPage /> },
  { path: 'employees/new', element: <NewEmployeePage /> },
  { path: 'employees/:id/edit', element: <EditEmployeePage /> },
];
