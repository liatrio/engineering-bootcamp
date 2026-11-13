import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { ada, grace, platform, portal } from '../../test/fixtures';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { Assignment } from './types';

const missingMessage = /The Assignments service isn.t running yet/;

const assignment: Assignment = {
  id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  employeeId: ada.id,
  projectId: platform.id,
  role: 'Tech Lead',
  allocationPercent: 50,
  startDate: '2026-01-05',
  endDate: null,
  createdAt: '2026-01-05T00:00:00Z',
  updatedAt: '2026-01-05T00:00:00Z',
};

function serveEmployeesAndProjects() {
  server.use(
    http.get('/api/employees', () => HttpResponse.json([ada, grace])),
    http.get('/api/projects', () => HttpResponse.json([platform, portal])),
  );
}

describe('Assignments', () => {
  beforeEach(serveEmployeesAndProjects);

  it.each([502, 503, 404])('shows a friendly message when the proxy answers %i', async (status) => {
    server.use(
      http.get('/api/assignments', () => new HttpResponse('<html>Bad Gateway</html>', { status })),
    );

    renderWithProviders('/assignments');

    expect(await screen.findByText(missingMessage)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'New assignment' })).not.toBeInTheDocument();
  });

  it('shows the same message when the request fails outright', async () => {
    server.use(http.get('/api/assignments', () => HttpResponse.error()));

    renderWithProviders('/assignments');

    expect(await screen.findByText(missingMessage)).toBeInTheDocument();
  });

  it('shows a 503 Problem Details from a running service as an error', async () => {
    server.use(
      http.get('/api/assignments', () =>
        HttpResponse.json(
          {
            title: 'Service Unavailable',
            status: 503,
            detail: 'employees-service is unavailable.',
          },
          { status: 503, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    );

    renderWithProviders('/assignments');

    expect(await screen.findByText(/employees-service is unavailable/)).toBeInTheDocument();
    expect(screen.queryByText(missingMessage)).not.toBeInTheDocument();
  });

  it('lists assignments with employee and project names', async () => {
    server.use(http.get('/api/assignments', () => HttpResponse.json([assignment])));

    renderWithProviders('/assignments');

    expect(await screen.findByRole('cell', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Platform Modernization' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '50%' })).toBeInTheDocument();
  });

  it('creates an assignment from the form', async () => {
    let body: unknown;
    server.use(
      http.get('/api/assignments', () => HttpResponse.json([])),
      http.post('/api/assignments', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ ...assignment, id: 'new' }, { status: 201 });
      }),
    );

    const { user, router } = renderWithProviders('/assignments/new');
    await user.selectOptions(await screen.findByLabelText('Employee'), 'Grace Hopper');
    await user.selectOptions(screen.getByLabelText('Project'), 'Customer Portal');
    await user.type(screen.getByLabelText('Role'), 'Developer');
    await user.clear(screen.getByLabelText('Allocation (%)'));
    await user.type(screen.getByLabelText('Allocation (%)'), '40');
    await user.type(screen.getByLabelText('Start date'), '2026-03-02');
    await user.click(screen.getByRole('button', { name: 'Create assignment' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/assignments'));
    expect(body).toEqual({
      employeeId: grace.id,
      projectId: portal.id,
      role: 'Developer',
      allocationPercent: 40,
      startDate: '2026-03-02',
      endDate: null,
    });
  });

  it('shows Problem Details field errors from the service', async () => {
    server.use(
      http.post('/api/assignments', () =>
        HttpResponse.json(
          {
            title: 'One or more validation errors occurred.',
            status: 400,
            errors: { employeeId: ['Employee does not exist.'] },
          },
          { status: 400, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    );

    const { user } = renderWithProviders('/assignments/new');
    await user.selectOptions(await screen.findByLabelText('Employee'), 'Ada Lovelace');
    await user.selectOptions(screen.getByLabelText('Project'), 'Platform Modernization');
    await user.type(screen.getByLabelText('Role'), 'Developer');
    await user.type(screen.getByLabelText('Start date'), '2026-03-02');
    await user.click(screen.getByRole('button', { name: 'Create assignment' }));

    expect(await screen.findByText('Employee does not exist.')).toBeInTheDocument();
    expect(screen.getByLabelText('Employee')).toHaveAttribute('aria-invalid', 'true');
  });
});
