export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiSelect';

export interface OperatorConfig {
  value: string;
  label: string;
  requiresValue: boolean;
  valueCount?: 'single' | 'multiple' | 'range';
}

export type FilterValue = string | number | boolean | string[] | number[] | null;

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: FilterValue;
}
