import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, api, jsonBody } from '../../lib/api';
import type { Assignment, AssignmentInput } from './types';

export const listAssignments = () => api<Assignment[]>('/api/assignments');
export const createAssignment = (body: AssignmentInput) =>
  api<Assignment>('/api/assignments', { method: 'POST', body: jsonBody(body) });
export const deleteAssignment = (id: string) =>
  api<undefined>(`/api/assignments/${id}`, { method: 'DELETE' });

export const assignmentKeys = { all: ['assignments'] as const };

/**
 * The starter has no assignments-service: learners build it in Chapter 3.3. Until then the
 * proxy answers 502 (or the request fails outright). A 503 *with* Problem Details means the
 * service is running but one of its dependencies is down, so that is shown as a normal error.
 */
export function isServiceMissing(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.status === 0 || error.status === 404 || error.status === 502) return true;
  return error.status === 503 && !error.isProblem;
}

export const useAssignments = () =>
  useQuery({ queryKey: assignmentKeys.all, queryFn: listAssignments });

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  });
}
