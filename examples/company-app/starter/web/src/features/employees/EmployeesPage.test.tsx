import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { vi } from 'vitest';
import { server } from '../../test/server';
import { ada, grace } from '../../test/fixtures';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { Employee } from './types';

describe('Employees', () => {
  it('lists employees', async () => {
    server.use(http.get('/api/employees', () => HttpResponse.json([ada, grace])));

    renderWithProviders('/employees');

    expect(await screen.findByRole('cell', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'grace@example.com' })).toBeInTheDocument();
  });

  it('creates an employee and returns to the list', async () => {
    const created: Employee[] = [];
    server.use(
      http.get('/api/employees', () => HttpResponse.json([ada, ...created])),
      http.post('/api/employees', async ({ request }) => {
        const body = (await request.json()) as Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
        const employee = { ...ada, ...body, id: 'new-id' };
        created.push(employee);
        return HttpResponse.json(employee, { status: 201 });
      }),
    );

    const { user, router } = renderWithProviders('/employees/new');
    await user.type(screen.getByLabelText('Name'), 'Katherine Johnson');
    await user.type(screen.getByLabelText('Email'), 'katherine@example.com');
    await user.type(screen.getByLabelText('Title'), 'Mathematician');
    await user.type(screen.getByLabelText('Department'), 'Research');
    await user.click(screen.getByRole('button', { name: 'Create employee' }));

    expect(await screen.findByRole('cell', { name: 'Katherine Johnson' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/employees');
  });

  it('shows client-side validation before calling the API', async () => {
    const { user } = renderWithProviders('/employees/new');
    await user.click(screen.getByRole('button', { name: 'Create employee' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows Problem Details errors next to the field', async () => {
    server.use(
      http.post('/api/employees', () =>
        HttpResponse.json(
          {
            type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
            title: 'One or more validation errors occurred.',
            status: 400,
            errors: { Email: ['That email domain is not allowed.'] },
          },
          { status: 400, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    );

    const { user } = renderWithProviders('/employees/new');
    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.type(screen.getByLabelText('Email'), 'ada@blocked.example');
    await user.type(screen.getByLabelText('Title'), 'Engineer');
    await user.type(screen.getByLabelText('Department'), 'Engineering');
    await user.click(screen.getByRole('button', { name: 'Create employee' }));

    const email = screen.getByLabelText('Email');
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
    expect(email).toHaveAccessibleDescription('That email domain is not allowed.');
  });

  it('shows a 409 conflict as a form error', async () => {
    server.use(
      http.post('/api/employees', () =>
        HttpResponse.json(
          { title: 'Conflict', status: 409, detail: 'An employee with that email already exists.' },
          { status: 409, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    );

    const { user } = renderWithProviders('/employees/new');
    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Title'), 'Engineer');
    await user.type(screen.getByLabelText('Department'), 'Engineering');
    await user.click(screen.getByRole('button', { name: 'Create employee' }));

    expect(
      await screen.findByText('An employee with that email already exists.'),
    ).toBeInTheDocument();
  });

  it('edits an employee', async () => {
    let saved: unknown;
    server.use(
      http.get(`/api/employees/${ada.id}`, () => HttpResponse.json(ada)),
      http.get('/api/employees', () => HttpResponse.json([ada])),
      http.put(`/api/employees/${ada.id}`, async ({ request }) => {
        saved = await request.json();
        return HttpResponse.json({ ...ada, ...(saved as object) });
      }),
    );

    const { user } = renderWithProviders(`/employees/${ada.id}/edit`);
    const title = await screen.findByLabelText('Title');
    await user.clear(title);
    await user.type(title, 'Distinguished Engineer');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await screen.findByRole('heading', { name: 'Employees' });
    expect(saved).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      title: 'Distinguished Engineer',
      department: 'Engineering',
    });
  });

  it('deletes an employee after confirmation', async () => {
    let employees = [ada, grace];
    server.use(
      http.get('/api/employees', () => HttpResponse.json(employees)),
      http.delete(`/api/employees/${grace.id}`, () => {
        employees = [ada];
        return new HttpResponse(null, { status: 204 });
      }),
    );
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { user } = renderWithProviders('/employees');
    const row = (await screen.findByRole('cell', { name: 'Grace Hopper' })).closest('tr');
    await user.click(
      within(row as HTMLElement).getByRole('button', { name: 'Delete Grace Hopper' }),
    );

    await waitFor(() => expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument());
  });
});
