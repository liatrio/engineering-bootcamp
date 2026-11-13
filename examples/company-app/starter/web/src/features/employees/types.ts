export interface Employee {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

/** Writable fields: the body of POST and PUT. */
export type EmployeeInput = Pick<Employee, 'name' | 'email' | 'title' | 'department'>;
