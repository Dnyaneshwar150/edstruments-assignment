import React, { useState, useCallback } from "react";
import {
  Popover,
  Box,
  Button,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import { OperatorSelector } from "./OperatorSelector";
import { DynamicInput } from "./DynamicInput";
import { ColumnConfig } from "../../types/table";
import {
  FilterCondition,
  FilterValue,
  OperatorConfig,
} from "../../types/filters";
import { getOperatorsForType } from "../../config/filterOperators";

interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  column: ColumnConfig;
  existingFilters: FilterCondition[];
  onApply: (field: string, operator: string, value: FilterValue) => void;
  onRemove: (id: string) => void;
  onClearField: (field: string) => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = React.memo(
  ({
    anchorEl,
    open,
    onClose,
    column,
    existingFilters,
    onApply,
    onRemove,
    onClearField,
  }) => {
    const operators = getOperatorsForType(column.type);
    const [selectedOperator, setSelectedOperator] = useState<OperatorConfig>(
      operators[0],
    );
    const [value, setValue] = useState<FilterValue>(null);

    const handleApply = useCallback(() => {
      if (selectedOperator.requiresValue && (value == null || value === ""))
        return;
      onApply(
        column.key,
        selectedOperator.value,
        selectedOperator.requiresValue ? value : null,
      );
      setValue(null);
      setSelectedOperator(operators[0]);
      onClose();
    }, [column.key, selectedOperator, value, onApply, operators, onClose]);

    const handleReset = useCallback(() => {
      onClearField(column.key);
      setValue(null);
      setSelectedOperator(operators[0]);
    }, [column.key, onClearField, operators]);

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Typography
            variant='subtitle2'
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Filter: {column.label}
          </Typography>

          {existingFilters.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant='caption'
                sx={{ color: "text.secondary", mb: 1, display: "block" }}
              >
                Active filters ({existingFilters.length})
              </Typography>
              {existingFilters.map((f) => (
                <Box
                  key={f.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    mb: 0.5,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    fontSize: "0.8rem",
                  }}
                >
                  <span>
                    {f.operator} {f.value != null ? String(f.value) : ""}
                  </span>
                  <Button
                    size='small'
                    color='error'
                    onClick={() => onRemove(f.id)}
                    sx={{
                      minWidth: "auto",
                      p: 0.5,
                      fontSize: "1rem",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </Button>
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
            </Box>
          )}

          <Stack spacing={2}>
            <OperatorSelector
              operators={operators}
              value={selectedOperator}
              onChange={setSelectedOperator}
            />

            {selectedOperator.requiresValue && (
              <DynamicInput
                column={column}
                operator={selectedOperator}
                value={value}
                onChange={setValue}
              />
            )}

            <Stack
              direction='row'
              spacing={1.5}
              sx={{ pt: 1 }}
            >
              <Button
                variant='outlined'
                size='small'
                onClick={handleReset}
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Reset
              </Button>
              <Button
                variant='contained'
                size='small'
                onClick={handleApply}
                fullWidth
                disabled={
                  selectedOperator.requiresValue &&
                  (value == null || value === "")
                }
                sx={{ textTransform: "none" }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    );
  },
);

FilterPopover.displayName = "FilterPopover";
