import React from "react";
import { Chip } from "@mui/material";
import { FilterCondition } from "../../types/filters";
import { ColumnConfig } from "../../types/table";

interface FilterChipProps {
  filter: FilterCondition;
  column: ColumnConfig | undefined;
  onRemove: (id: string) => void;
}

export const FilterChip: React.FC<FilterChipProps> = React.memo(
  ({ filter, column, onRemove }) => {
    const label = column?.label || filter.field;
    const valueStr =
      filter.value != null
        ? Array.isArray(filter.value)
          ? filter.value.join(", ")
          : String(filter.value)
        : "";
    const chipLabel = valueStr
      ? `${label} ${filter.operator} ${valueStr}`
      : `${label} ${filter.operator}`;

    return (
      <Chip
        label={chipLabel}
        onDelete={() => onRemove(filter.id)}
        size='small'
        variant='outlined'
        color='primary'
        sx={{
          borderRadius: "6px",
          fontWeight: 500,
          "& .MuiChip-label": {
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
      />
    );
  },
);

FilterChip.displayName = "FilterChip";
