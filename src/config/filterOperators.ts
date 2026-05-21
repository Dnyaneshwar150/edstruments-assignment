import { FieldType, OperatorConfig } from "../types/filters";

export const operatorsByType: Record<FieldType, OperatorConfig[]> = {
  text: [
    { value: "contains", label: "Contains", requiresValue: true },
    {
      value: "does not contain",
      label: "Does not contain",
      requiresValue: true,
    },
    { value: "equals", label: "Equals", requiresValue: true },
    { value: "does not equal", label: "Does not equal", requiresValue: true },
    { value: "starts with", label: "Starts with", requiresValue: true },
    { value: "ends with", label: "Ends with", requiresValue: true },
    { value: "is empty", label: "Is empty", requiresValue: false },
    { value: "is not empty", label: "Is not empty", requiresValue: false },
    {
      value: "is any of",
      label: "Is any of",
      requiresValue: true,
      valueCount: "multiple",
    },
  ],
  number: [
    { value: "=", label: "=", requiresValue: true },
    { value: "!=", label: "\u2260", requiresValue: true },
    { value: ">", label: ">", requiresValue: true },
    { value: ">=", label: "\u2265", requiresValue: true },
    { value: "<", label: "<", requiresValue: true },
    { value: "<=", label: "\u2264", requiresValue: true },
    { value: "is empty", label: "Is empty", requiresValue: false },
    { value: "is not empty", label: "Is not empty", requiresValue: false },
    {
      value: "is any of",
      label: "Is any of",
      requiresValue: true,
      valueCount: "multiple",
    },
    {
      value: "between",
      label: "Between",
      requiresValue: true,
      valueCount: "range",
    },
  ],
  select: [
    { value: "is", label: "Is", requiresValue: true },
    { value: "is not", label: "Is not", requiresValue: true },
    {
      value: "is any of",
      label: "Is any of",
      requiresValue: true,
      valueCount: "multiple",
    },
  ],
  multiSelect: [
    {
      value: "in",
      label: "Includes any of",
      requiresValue: true,
      valueCount: "multiple",
    },
    {
      value: "not in",
      label: "Excludes all of",
      requiresValue: true,
      valueCount: "multiple",
    },
  ],
  boolean: [{ value: "is", label: "Is", requiresValue: true }],
  date: [
    { value: "before", label: "Before", requiresValue: true },
    { value: "after", label: "After", requiresValue: true },
    {
      value: "between",
      label: "Between",
      requiresValue: true,
      valueCount: "range",
    },
    { value: "last 7 days", label: "Last 7 days", requiresValue: false },
    { value: "last 30 days", label: "Last 30 days", requiresValue: false },
    { value: "is empty", label: "Is empty", requiresValue: false },
    { value: "is not empty", label: "Is not empty", requiresValue: false },
  ],
};

export const getOperatorsForType = (type: FieldType): OperatorConfig[] => {
  return operatorsByType[type] || [];
};
