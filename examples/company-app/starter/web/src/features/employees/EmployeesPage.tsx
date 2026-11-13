import { Link } from 'react-router';
import { EmptyState, ErrorMessage, Loading } from '../../lib/ui/status';
import { FormError } from '../../lib/ui/form';
import { useDeleteEmployee, useEmployees } from './api';
import type { Employee } from './types';

export function EmployeesPage() {
  const employees = useEmployees();
  const remove = useDeleteEmployee();

  const onDelete = (employee: Employee) => {
    if (window.confirm(`Delete ${employee.name}?`)) remove.mutate(employee.id);
  };

  return (
    <section aria-labelledby="employees-heading">
      <header className="page-header">
        <h1 id="employees-heading">Employees</h1>
        <Link className="btn btn-primary" to="/employees/new">
          New employee
        </Link>
      </header>

      <FormError error={remove.error} />
      {employees.isPending && <Loading />}
      {employees.isError && <ErrorMessage error={employees.error} />}
      {employees.isSuccess && employees.data.length === 0 && (
        <EmptyState>No employees yet. Add the first one.</EmptyState>
      )}
      {employees.isSuccess && employees.data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Title</th>
              <th scope="col">Department</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.data.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.title}</td>
                <td>{employee.department}</td>
                <td className="actions">
                  <Link to={`/employees/${employee.id}/edit`} aria-label={`Edit ${employee.name}`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-link danger"
                    onClick={() => onDelete(employee)}
                    aria-label={`Delete ${employee.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
