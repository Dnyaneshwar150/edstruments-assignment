import { ReactNode } from 'react';
import { FieldType } from './filters';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ColumnConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  key: string;
  label: string;
  type: FieldType;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: number;
  options?: SelectOption[];
  render?: (value: unknown, row: T) => ReactNode;
  format?: (value: unknown) => string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  rowsPerPage: number;
}
