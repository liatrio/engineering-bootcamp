import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { FormError, SubmitButton, TextField } from '../../lib/ui/form';
import { applyServerErrors } from '../../lib/ui/serverErrors';
import { ErrorMessage, Loading } from '../../lib/ui/status';
import { useEmployee, useSaveEmployee } from './api';
import type { Employee, EmployeeInput } from './types';

// Mirrors the server rules in SPEC.md. The server is still the authority: its 400 Problem
// Details are copied onto these same fields.
const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'At most 100 characters'),
  email: z.email('Enter a valid email address'),
  title: z.string().trim().min(1, 'Title is required').max(100, 'At most 100 characters'),
  department: z.string().trim().min(1, 'Department is required').max(100, 'At most 100 characters'),
});
const fields = ['name', 'email', 'title', 'department'] as const;

export function NewEmployeePage() {
  return <EmployeeForm />;
}

export function EditEmployeePage() {
  const { id = '' } = useParams();
  const employee = useEmployee(id);
  if (employee.isPending) return <Loading />;
  if (employee.isError) return <ErrorMessage error={employee.error} />;
  return <EmployeeForm employee={employee.data} />;
}

function EmployeeForm({ employee }: { employee?: Employee }) {
  const navigate = useNavigate();
  const save = useSaveEmployee(employee?.id);
  const form = useForm<EmployeeInput>({
    resolver: zodResolver(schema),
    defaultValues: employee
      ? {
          name: employee.name,
          email: employee.email,
          title: employee.title,
          department: employee.department,
        }
      : { name: '', email: '', title: '', department: '' },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    save.mutate(values, {
      onSuccess: () => navigate('/employees'),
      onError: (error) => applyServerErrors(error, fields, form.setError),
    }),
  );

  const heading = employee ? `Edit ${employee.name}` : 'New employee';
  return (
    <section aria-labelledby="employee-form-heading">
      <h1 id="employee-form-heading">{heading}</h1>
      <form onSubmit={onSubmit} noValidate className="form">
        <TextField
          label="Name"
          autoComplete="name"
          error={errors.name}
          {...form.register('name')}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
          {...form.register('email')}
        />
        <TextField label="Title" error={errors.title} {...form.register('title')} />
        <TextField label="Department" error={errors.department} {...form.register('department')} />
        <FormError error={save.error} fields={fields} />
        <div className="form-actions">
          <SubmitButton pending={save.isPending}>
            {employee ? 'Save changes' : 'Create employee'}
          </SubmitButton>
          <Link to="/employees">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
