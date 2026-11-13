import { Link } from 'react-router';
import { EmptyState, ErrorMessage, Loading } from '../../lib/ui/status';
import { FormError } from '../../lib/ui/form';
import { useEmployees } from '../employees/api';
import { useProjects } from '../projects/api';
import { isServiceMissing, useAssignments, useDeleteAssignment } from './api';
import { ServiceMissing } from './ServiceMissing';

export function AssignmentsPage() {
  const assignments = useAssignments();
  const employees = useEmployees();
  const projects = useProjects();
  const remove = useDeleteAssignment();

  const employeeName = new Map(employees.data?.map((e) => [e.id, e.name]));
  const projectName = new Map(projects.data?.map((p) => [p.id, p.name]));
  const missing = assignments.isError && isServiceMissing(assignments.error);

  return (
    <section aria-labelledby="assignments-heading">
      <header className="page-header">
        <h1 id="assignments-heading">Assignments</h1>
        {!missing && (
          <Link className="btn btn-primary" to="/assignments/new">
            New assignment
          </Link>
        )}
      </header>

      <FormError error={remove.error} />
      {assignments.isPending && <Loading />}
      {missing && <ServiceMissing />}
      {assignments.isError && !missing && <ErrorMessage error={assignments.error} />}
      {assignments.isSuccess && assignments.data.length === 0 && (
        <EmptyState>No assignments yet. Assign someone to a project.</EmptyState>
      )}
      {assignments.isSuccess && assignments.data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Employee</th>
              <th scope="col">Project</th>
              <th scope="col">Role</th>
              <th scope="col">Allocation</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {assignments.data.map((a) => {
              const who = employeeName.get(a.employeeId) ?? a.employeeId;
              const what = projectName.get(a.projectId) ?? a.projectId;
              return (
                <tr key={a.id}>
                  <td>{who}</td>
                  <td>{what}</td>
                  <td>{a.role}</td>
                  <td>{a.allocationPercent}%</td>
                  <td>{a.startDate}</td>
                  <td>{a.endDate ?? '—'}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-link danger"
                      aria-label={`Delete assignment of ${who} to ${what}`}
                      onClick={() => {
                        if (window.confirm(`Remove ${who} from ${what}?`)) remove.mutate(a.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
