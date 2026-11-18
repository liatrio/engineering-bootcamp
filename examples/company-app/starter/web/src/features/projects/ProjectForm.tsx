import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { FormError, SelectField, SubmitButton, TextAreaField, TextField } from '../../lib/ui/form';
import { applyServerErrors } from '../../lib/ui/serverErrors';
import { ErrorMessage, Loading } from '../../lib/ui/status';
import { useProject, useSaveProject } from './api';
import { projectStatuses, type Project, type ProjectInput } from './types';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'At most 100 characters'),
  description: z.string().max(500, 'At most 500 characters'),
  startDate: z.iso.date('Pick a start date'),
  status: z.enum(projectStatuses),
});
const fields = ['name', 'description', 'startDate', 'status'] as const;

export function NewProjectPage() {
  return <ProjectForm />;
}

export function EditProjectPage() {
  const { id = '' } = useParams();
  const project = useProject(id);
  if (project.isPending) return <Loading />;
  if (project.isError) return <ErrorMessage error={project.error} />;
  return <ProjectForm project={project.data} />;
}

function ProjectForm({ project }: { project?: Project }) {
  const navigate = useNavigate();
  const save = useSaveProject(project?.id);
  const form = useForm<ProjectInput>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          status: project.status,
        }
      : { name: '', description: '', startDate: '', status: 'planned' },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    save.mutate(values, {
      onSuccess: () => navigate('/projects'),
      onError: (error) => applyServerErrors(error, fields, form.setError),
    }),
  );

  return (
    <section aria-labelledby="project-form-heading">
      <h1 id="project-form-heading">{project ? `Edit ${project.name}` : 'New project'}</h1>
      <form onSubmit={onSubmit} noValidate className="form">
        <TextField label="Name" error={errors.name} {...form.register('name')} />
        <TextAreaField
          label="Description"
          hint="Optional, up to 500 characters."
          error={errors.description}
          {...form.register('description')}
        />
        <TextField
          label="Start date"
          type="date"
          error={errors.startDate}
          {...form.register('startDate')}
        />
        <SelectField label="Status" error={errors.status} {...form.register('status')}>
          {projectStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </SelectField>
        <FormError error={save.error} fields={fields} />
        <div className="form-actions">
          <SubmitButton pending={save.isPending}>
            {project ? 'Save changes' : 'Create project'}
          </SubmitButton>
          <Link to="/projects">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
