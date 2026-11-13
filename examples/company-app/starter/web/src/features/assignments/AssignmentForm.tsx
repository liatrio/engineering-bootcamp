import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { FormError, SelectField, SubmitButton, TextField } from '../../lib/ui/form';
import { applyServerErrors } from '../../lib/ui/serverErrors';
import { ErrorMessage, Loading } from '../../lib/ui/status';
import { useEmployees } from '../employees/api';
import { useProjects } from '../projects/api';
import { isServiceMissing, useCreateAssignment } from './api';
import { ServiceMissing } from './ServiceMissing';
import type { AssignmentInput } from './types';

// Form values are strings (what inputs hold); the schema turns them into the API shape.
const schema = z.object({
  employeeId: z.string().min(1, 'Pick an employee'),
  projectId: z.string().min(1, 'Pick a project'),
  role: z.string().trim().min(1, 'Role is required').max(100, 'At most 100 characters'),
  allocationPercent: z.coerce
    .number<string>({ error: 'Enter a number' })
    .int('Whole numbers only')
    .min(1, 'At least 1')
    .max(100, 'At most 100'),
  startDate: z.iso.date('Pick a start date'),
  endDate: z
    .union([z.iso.date(), z.literal('')])
    .transform((value) => (value === '' ? null : value)),
});
type FormValues = z.input<typeof schema>;
const fields = [
  'employeeId',
  'projectId',
  'role',
  'allocationPercent',
  'startDate',
  'endDate',
] as const;

export function NewAssignmentPage() {
  const navigate = useNavigate();
  const employees = useEmployees();
  const projects = useProjects();
  const create = useCreateAssignment();
  const form = useForm<FormValues, unknown, AssignmentInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: '',
      projectId: '',
      role: '',
      allocationPercent: '100',
      startDate: '',
      endDate: '',
    },
  });
  const { errors } = form.formState;

  if (employees.isPending || projects.isPending) return <Loading />;
  if (employees.isError) return <ErrorMessage error={employees.error} />;
  if (projects.isError) return <ErrorMessage error={projects.error} />;

  const onSubmit = form.handleSubmit((values) =>
    create.mutate(values, {
      onSuccess: () => navigate('/assignments'),
      onError: (error) => applyServerErrors(error, fields, form.setError),
    }),
  );

  return (
    <section aria-labelledby="assignment-form-heading">
      <h1 id="assignment-form-heading">New assignment</h1>
      <form onSubmit={onSubmit} noValidate className="form">
        <SelectField label="Employee" error={errors.employeeId} {...form.register('employeeId')}>
          <option value="">Select an employee…</option>
          {employees.data.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="Project" error={errors.projectId} {...form.register('projectId')}>
          <option value="">Select a project…</option>
          {projects.data.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </SelectField>
        <TextField label="Role" error={errors.role} {...form.register('role')} />
        <TextField
          label="Allocation (%)"
          type="number"
          min={1}
          max={100}
          step={1}
          inputMode="numeric"
          error={errors.allocationPercent}
          {...form.register('allocationPercent')}
        />
        <TextField
          label="Start date"
          type="date"
          error={errors.startDate}
          {...form.register('startDate')}
        />
        <TextField
          label="End date"
          type="date"
          hint="Optional. Leave empty for an open-ended assignment."
          error={errors.endDate}
          {...form.register('endDate')}
        />
        {isServiceMissing(create.error) ? (
          <ServiceMissing />
        ) : (
          <FormError error={create.error} fields={fields} />
        )}
        <div className="form-actions">
          <SubmitButton pending={create.isPending}>Create assignment</SubmitButton>
          <Link to="/assignments">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
