import { FilterValue } from "../types/filters";

export const applyBooleanFilter = (
  fieldValue: unknown,
  _operator: string,
  filterValue: FilterValue,
): boolean => {
  if (filterValue === "any" || filterValue === null) return true;
  const boolValue = Boolean(fieldValue);
  const targetValue = filterValue === true || filterValue === "true";
  return boolValue === targetValue;
};

const toDate = (value: unknown): Date | null => {
  if (value == null) return null;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
};

const startOfDay = (d: Date): Date => {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const applyDateFilter = (
  fieldValue: unknown,
  operator: string,
  filterValue: FilterValue,
): boolean => {
  const dateValue = toDate(fieldValue);
  const isEmpty = dateValue === null;

  switch (operator) {
    case "before": {
      if (isEmpty) return false;
      const target = toDate(filterValue);
      return target !== null && dateValue < target;
    }
    case "after": {
      if (isEmpty) return false;
      const target = toDate(filterValue);
      return target !== null && dateValue > target;
    }
    case "between": {
      if (isEmpty || !Array.isArray(filterValue) || filterValue.length !== 2)
        return false;
      const start = toDate(filterValue[0]);
      const end = toDate(filterValue[1]);
      return (
        start !== null && end !== null && dateValue >= start && dateValue <= end
      );
    }
    case "last 7 days": {
      if (isEmpty) return false;
      const now = new Date();
      const weekAgo = startOfDay(
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      );
      return dateValue >= weekAgo && dateValue <= now;
    }
    case "last 30 days": {
      if (isEmpty) return false;
      const now = new Date();
      const monthAgo = startOfDay(
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      );

      return dateValue >= monthAgo && dateValue <= now;
    }
    case "is empty":
      return isEmpty;
    case "is not empty":
      return !isEmpty;
    default:
      return true;
  }
};

export const applyMultiSelectFilter = (
  fieldValue: unknown,
  operator: string,
  filterValue: FilterValue,
): boolean => {
  const fieldArray: string[] = Array.isArray(fieldValue)
    ? fieldValue.map((v) => String(v).toLowerCase())
    : [];

  if (!Array.isArray(filterValue)) return true;
  const targetValues = filterValue.map((v) => String(v).toLowerCase());

  switch (operator) {
    case "in":
      return targetValues.some((v) => fieldArray.includes(v));
    case "not in":
      return !targetValues.some((v) => fieldArray.includes(v));
    default:
      return true;
  }
};

export const applyNumberFilter = (
  fieldValue: unknown,
  operator: string,
  filterValue: FilterValue,
): boolean => {
  const isEmpty = fieldValue == null || String(fieldValue).trim() === "";
  const numValue = Number(fieldValue);

  switch (operator) {
    case "=":
      return !isEmpty && numValue === Number(filterValue);
    case "!=":
      return isEmpty || numValue !== Number(filterValue);
    case ">":
      return !isEmpty && numValue > Number(filterValue);
    case ">=":
      return !isEmpty && numValue >= Number(filterValue);
    case "<":
      return !isEmpty && numValue < Number(filterValue);
    case "<=":
      return !isEmpty && numValue <= Number(filterValue);
    case "is empty":
      return isEmpty;
    case "is not empty":
      return !isEmpty;
    case "is any of": {
      if (!Array.isArray(filterValue)) return false;
      return filterValue.map(Number).includes(numValue);
    }
    case "between": {
      if (!Array.isArray(filterValue) || filterValue.length !== 2) return false;
      const [min, max] = filterValue.map(Number);
      return !isEmpty && numValue >= min && numValue <= max;
    }
    default:
      return true;
  }
};

export const applySelectFilter = (
  fieldValue: unknown,
  operator: string,
  filterValue: FilterValue,
): boolean => {
  const strValue = fieldValue != null ? String(fieldValue).toLowerCase() : "";

  switch (operator) {
    case "is":
      return strValue === String(filterValue ?? "").toLowerCase();
    case "is not":
      return strValue !== String(filterValue ?? "").toLowerCase();
    case "is any of": {
      if (!Array.isArray(filterValue)) return false;
      return filterValue.map((v) => String(v).toLowerCase()).includes(strValue);
    }
    default:
      return true;
  }
};

export const applyTextFilter = (
  fieldValue: unknown,
  operator: string,
  filterValue: FilterValue,
): boolean => {
  const strValue =
    fieldValue != null ? String(fieldValue).trim().toLowerCase() : "";
  const isEmpty = fieldValue == null || String(fieldValue).trim() === "";

  switch (operator) {
    case "contains":
      return (
        !isEmpty &&
        strValue.includes(
          String(filterValue ?? "")
            .trim()
            .toLowerCase(),
        )
      );
    case "does not contain":
      return (
        isEmpty ||
        !strValue.includes(
          String(filterValue ?? "")
            .trim()
            .toLowerCase(),
        )
      );
    case "equals":
      return (
        strValue ===
        String(filterValue ?? "")
          .trim()
          .toLowerCase()
      );
    case "does not equal":
      return (
        strValue !==
        String(filterValue ?? "")
          .trim()
          .toLowerCase()
      );
    case "starts with":
      return (
        !isEmpty &&
        strValue.startsWith(
          String(filterValue ?? "")
            .trim()
            .toLowerCase(),
        )
      );
    case "ends with":
      return (
        !isEmpty &&
        strValue.endsWith(
          String(filterValue ?? "")
            .trim()
            .toLowerCase(),
        )
      );
    case "is empty":
      return isEmpty;
    case "is not empty":
      return !isEmpty;
    case "is any of": {
      if (!Array.isArray(filterValue)) return false;
      const values = filterValue.map((v) => String(v).trim().toLowerCase());
      return values.includes(strValue);
    }
    default:
      return true;
  }
};
