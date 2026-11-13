import { Link } from 'react-router';
import { EmptyState, ErrorMessage, Loading } from '../../lib/ui/status';
import { useProjects } from './api';

export function ProjectsPage() {
  const projects = useProjects();

  return (
    <section aria-labelledby="projects-heading">
      <header className="page-header">
        <h1 id="projects-heading">Projects</h1>
        <Link className="btn btn-primary" to="/projects/new">
          New project
        </Link>
      </header>

      {projects.isPending && <Loading />}
      {projects.isError && <ErrorMessage error={projects.error} />}
      {projects.isSuccess && projects.data.length === 0 && (
        <EmptyState>No projects yet. Add the first one.</EmptyState>
      )}
      {projects.isSuccess && projects.data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Start date</th>
              <th scope="col">Description</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.data.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>
                  <span className={`badge badge-${project.status}`}>{project.status}</span>
                </td>
                <td>{project.startDate}</td>
                <td>{project.description}</td>
                <td className="actions">
                  <Link to={`/projects/${project.id}/edit`} aria-label={`Edit ${project.name}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
