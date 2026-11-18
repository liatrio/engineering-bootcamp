import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { platform, portal } from '../../test/fixtures';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('Projects', () => {
  it('lists projects with their status', async () => {
    server.use(http.get('/api/projects', () => HttpResponse.json([platform, portal])));

    renderWithProviders('/projects');

    expect(await screen.findByRole('cell', { name: 'Platform Modernization' })).toBeInTheDocument();
    expect(screen.getByText('planned')).toBeInTheDocument();
  });

  it('creates a project', async () => {
    let body: unknown;
    server.use(
      http.get('/api/projects', () => HttpResponse.json([platform])),
      http.post('/api/projects', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ ...platform, id: 'new' }, { status: 201 });
      }),
    );

    const { user, router } = renderWithProviders('/projects/new');
    await user.type(screen.getByLabelText('Name'), 'Mobile App');
    await user.type(screen.getByLabelText('Start date'), '2026-12-01');
    await user.click(screen.getByRole('button', { name: 'Create project' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/projects'));
    expect(body).toEqual({
      name: 'Mobile App',
      description: '',
      startDate: '2026-12-01',
      status: 'planned',
    });
  });

  it('changes a project status', async () => {
    let body: { status?: string } = {};
    server.use(
      http.get(`/api/projects/${portal.id}`, () => HttpResponse.json(portal)),
      http.get('/api/projects', () => HttpResponse.json([portal])),
      http.put(`/api/projects/${portal.id}`, async ({ request }) => {
        body = (await request.json()) as typeof body;
        return HttpResponse.json({ ...portal, ...body });
      }),
    );

    const { user } = renderWithProviders(`/projects/${portal.id}/edit`);
    await user.selectOptions(await screen.findByLabelText('Status'), 'active');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await screen.findByRole('heading', { name: 'Projects' });
    expect(body.status).toBe('active');
  });

  it('shows a 409 from the service as a form error', async () => {
    server.use(
      http.get(`/api/projects/${portal.id}`, () => HttpResponse.json(portal)),
      http.put(`/api/projects/${portal.id}`, () =>
        HttpResponse.json(
          {
            title: 'Conflict',
            status: 409,
            detail: 'Cannot move a project from planned to completed.',
          },
          { status: 409, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    );

    const { user } = renderWithProviders(`/projects/${portal.id}/edit`);
    await user.selectOptions(await screen.findByLabelText('Status'), 'completed');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(
      await screen.findByText('Cannot move a project from planned to completed.'),
    ).toBeInTheDocument();
  });
});
