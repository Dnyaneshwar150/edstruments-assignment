import { FilterCondition, FilterValue, FieldType } from "../types/filters";
import { ColumnConfig } from "../types/table";
import { getNestedValue } from "../utils/helper";
import {
  applyBooleanFilter,
  applyDateFilter,
  applyMultiSelectFilter,
  applyNumberFilter,
  applySelectFilter,
  applyTextFilter,
} from "./filters";

type FilterFn = (
  fieldValue: unknown,
  operator: string,
  filterValue: FilterValue,
) => boolean;

const filterByType: Record<FieldType, FilterFn> = {
  text: applyTextFilter,
  number: applyNumberFilter,
  boolean: applyBooleanFilter,
  select: applySelectFilter,
  multiSelect: applyMultiSelectFilter,
  date: applyDateFilter,
};

export const applyFilters = <T extends Record<string, unknown>>(
  data: T[],
  filters: FilterCondition[],
  columns: ColumnConfig<T>[],
): T[] => {
  if (filters.length === 0) return data;

  const columnMap = new Map(columns.map((c) => [c.key, c]));

  const filtersByField = new Map<string, FilterCondition[]>();
  for (const filter of filters) {
    const existing = filtersByField.get(filter.field) || [];
    existing.push(filter);
    filtersByField.set(filter.field, existing);
  }

  return data.filter((row) => {
    for (const [field, fieldFilters] of filtersByField) {
      const column = columnMap.get(field);
      if (!column) continue;

      const fieldValue = getNestedValue(row, field);
      const filterFn = filterByType[column.type];
      if (!filterFn) continue;

      const fieldMatch = fieldFilters.some((filter) =>
        filterFn(fieldValue, filter.operator, filter.value),
      );

      if (!fieldMatch) return false;
    }
    return true;
  });
};
