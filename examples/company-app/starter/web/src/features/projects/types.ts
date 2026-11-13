export const projectStatuses = ['planned', 'active', 'completed'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export interface Project {
  id: string;
  name: string;
  description: string;
  /** YYYY-MM-DD */
  startDate: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

/** Writable fields: the body of POST and PUT. */
export type ProjectInput = Pick<Project, 'name' | 'description' | 'startDate' | 'status'>;
