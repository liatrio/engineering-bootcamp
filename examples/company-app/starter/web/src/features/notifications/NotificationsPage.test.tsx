import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { renderWithProviders } from '../../test/renderWithProviders';
import { POLL_INTERVAL_MS } from './api';
import type { Notification } from './types';

const first: Notification = {
  id: 'n1',
  type: 'employee.created',
  message: 'Employee Ada Lovelace was created',
  occurredAt: '2026-01-01T10:00:00Z',
  traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
};
const second: Notification = {
  id: 'n2',
  type: 'employee.updated',
  message: 'Employee Ada Lovelace was updated',
  occurredAt: '2026-01-01T10:01:00Z',
  traceId: '',
};

describe('Notifications', () => {
  it('polls every 5 seconds', () => {
    expect(POLL_INTERVAL_MS).toBe(5_000);
  });

  it('shows notifications newest first and picks up new ones on the next poll', async () => {
    let feed = [first];
    server.use(http.get('/api/notifications', () => HttpResponse.json(feed)));

    const { client } = renderWithProviders('/notifications');

    expect(await screen.findByText('Employee Ada Lovelace was created')).toBeInTheDocument();
    expect(screen.getByText(first.traceId)).toBeInTheDocument();

    feed = [second, first];
    // Same effect as the interval firing, without waiting 5 real seconds.
    await client.refetchQueries({ queryKey: ['notifications'] });

    const feedList = (await screen.findByText('Employee Ada Lovelace was updated')).closest('ol');
    const items = within(feedList as HTMLElement).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Employee Ada Lovelace was updated');
  });

  it('shows an empty state', async () => {
    server.use(http.get('/api/notifications', () => HttpResponse.json([])));

    renderWithProviders('/notifications');

    expect(await screen.findByText(/Nothing yet/)).toBeInTheDocument();
  });
});
