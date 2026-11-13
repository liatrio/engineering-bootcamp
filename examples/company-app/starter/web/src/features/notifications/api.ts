import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Notification } from './types';

export const POLL_INTERVAL_MS = 5_000;

export const listNotifications = () => api<Notification[]>('/api/notifications');

/** Newest first. Polls every 5 s; notifications-service keeps the latest 100 in memory. */
export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
    refetchInterval: POLL_INTERVAL_MS,
  });
