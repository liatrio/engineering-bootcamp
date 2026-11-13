export interface Assignment {
  id: string;
  employeeId: string;
  projectId: string;
  role: string;
  allocationPercent: number;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD, or null for open-ended */
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentInput = Pick<
  Assignment,
  'employeeId' | 'projectId' | 'role' | 'allocationPercent' | 'startDate' | 'endDate'
>;
