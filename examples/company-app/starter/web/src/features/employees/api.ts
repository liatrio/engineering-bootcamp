import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, jsonBody } from '../../lib/api';
import type { Employee, EmployeeInput } from './types';

// One line per endpoint. Base URL and error mapping come from api().
export const listEmployees = () => api<Employee[]>('/api/employees');
export const getEmployee = (id: string) => api<Employee>(`/api/employees/${id}`);
export const createEmployee = (body: EmployeeInput) =>
  api<Employee>('/api/employees', { method: 'POST', body: jsonBody(body) });
export const updateEmployee = (id: string, body: EmployeeInput) =>
  api<Employee>(`/api/employees/${id}`, { method: 'PUT', body: jsonBody(body) });
export const deleteEmployee = (id: string) =>
  api<undefined>(`/api/employees/${id}`, { method: 'DELETE' });

export const employeeKeys = {
  all: ['employees'] as const,
  detail: (id: string) => ['employees', id] as const,
};

export const useEmployees = () => useQuery({ queryKey: employeeKeys.all, queryFn: listEmployees });

export const useEmployee = (id: string) =>
  useQuery({ queryKey: employeeKeys.detail(id), queryFn: () => getEmployee(id) });

export function useSaveEmployee(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: EmployeeInput) => (id ? updateEmployee(id, body) : createEmployee(body)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  });
}
