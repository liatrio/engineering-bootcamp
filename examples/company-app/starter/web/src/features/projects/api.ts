import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, jsonBody } from '../../lib/api';
import type { Project, ProjectInput } from './types';

// The Pact consumer test in api.pact.test.ts exercises listProjects and getProject.
export const listProjects = () => api<Project[]>('/api/projects');
export const getProject = (id: string) => api<Project>(`/api/projects/${id}`);
export const createProject = (body: ProjectInput) =>
  api<Project>('/api/projects', { method: 'POST', body: jsonBody(body) });
export const updateProject = (id: string, body: ProjectInput) =>
  api<Project>(`/api/projects/${id}`, { method: 'PUT', body: jsonBody(body) });

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
};

export const useProjects = () => useQuery({ queryKey: projectKeys.all, queryFn: listProjects });

export const useProject = (id: string) =>
  useQuery({ queryKey: projectKeys.detail(id), queryFn: () => getProject(id) });

export function useSaveProject(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProjectInput) => (id ? updateProject(id, body) : createProject(body)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
