import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Stack,
  Autocomplete,
  Chip,
} from "@mui/material";
import { ColumnConfig } from "../../types/table";
import { FilterValue, OperatorConfig } from "../../types/filters";
import { debounce } from "../../utils/helper";

interface DynamicInputProps {
  column: ColumnConfig;
  operator: OperatorConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export const DynamicInput: React.FC<DynamicInputProps> = React.memo(
  ({ column, operator, value, onChange }) => {
    const [localValue, setLocalValue] = useState<string>(
      value != null ? String(value) : "",
    );

    useEffect(() => {
      setLocalValue(value != null ? String(value) : "");
    }, [value]);

    const debouncedOnChange = useMemo(
      () => debounce((val: string) => onChange(val), 300),
      [onChange],
    );

    const handleTextChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        debouncedOnChange(newValue);
      },
      [debouncedOnChange],
    );

    if (operator.valueCount === "range") {
      const rangeValues = Array.isArray(value) ? value : ["", ""];

      if (column.type === "date") {
        return (
          <Stack spacing={1.5}>
            <TextField
              size='small'
              type='date'
              label='From'
              value={rangeValues[0] || ""}
              onChange={(e) =>
                onChange([e.target.value, String(rangeValues[1] || "")])
              }
              fullWidth
            />
            <TextField
              size='small'
              type='date'
              label='To'
              value={rangeValues[1] || ""}
              onChange={(e) =>
                onChange([String(rangeValues[0] || ""), e.target.value])
              }
              fullWidth
            />
          </Stack>
        );
      }

      return (
        <Stack spacing={1.5}>
          <TextField
            size='small'
            type='number'
            label='Min'
            value={rangeValues[0] || ""}
            onChange={(e) =>
              onChange([e.target.value, String(rangeValues[1] || "")])
            }
            fullWidth
          />
          <TextField
            size='small'
            type='number'
            label='Max'
            value={rangeValues[1] || ""}
            onChange={(e) =>
              onChange([String(rangeValues[0] || ""), e.target.value])
            }
            fullWidth
          />
        </Stack>
      );
    }

    if (operator.valueCount === "multiple") {
      if (column.options) {
        const selectedValues = Array.isArray(value) ? (value as string[]) : [];
        return (
          <FormControl
            size='small'
            fullWidth
          >
            <InputLabel>Values</InputLabel>
            <Select<string[]>
              multiple
              value={selectedValues}
              label='Values'
              onChange={(e) => onChange(e.target.value as string[])}
              renderValue={(selected) => selected.join(", ")}
            >
              {column.options.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                >
                  <Checkbox
                    checked={selectedValues.includes(opt.value)}
                    size='small'
                  />
                  <ListItemText primary={opt.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }

      const chipValues = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Autocomplete
          multiple
          freeSolo
          size='small'
          options={[] as string[]}
          value={chipValues}
          onChange={(_: React.SyntheticEvent, newValue: unknown) =>
            onChange(newValue as string[])
          }
          // @ts-expect-error – MUI v9 Autocomplete freeSolo+multiple renderTags typing mismatch
          renderTags={(
            tagValue: unknown[],
            getTagProps: (arg: { index: number }) => object,
          ) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={String(option)}
                label={String(option)}
                size='small'
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label='Values (press Enter)'
              placeholder='Add value...'
            />
          )}
        />
      );
    }

    switch (column.type) {
      case "text":
        return (
          <TextField
            size='small'
            label='Value'
            value={localValue}
            onChange={handleTextChange}
            fullWidth
            placeholder='Enter text...'
          />
        );

      case "number":
        return (
          <TextField
            size='small'
            type='number'
            label='Value'
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              onChange(e.target.value ? Number(e.target.value) : null);
            }}
            fullWidth
            placeholder='Enter number...'
          />
        );

      case "date":
        return (
          <TextField
            size='small'
            type='date'
            label='Date'
            value={value != null ? String(value) : ""}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
          />
        );

      case "boolean":
        return (
          <FormControl
            size='small'
            fullWidth
          >
            <InputLabel>Value</InputLabel>
            <Select
              value={value != null ? String(value) : ""}
              label='Value'
              onChange={(e) => onChange(e.target.value)}
            >
              <MenuItem value='true'>Yes</MenuItem>
              <MenuItem value='false'>No</MenuItem>
              <MenuItem value='any'>Any</MenuItem>
            </Select>
          </FormControl>
        );

      case "select":
        return (
          <FormControl
            size='small'
            fullWidth
          >
            <InputLabel>Value</InputLabel>
            <Select
              value={value != null ? String(value) : ""}
              label='Value'
              onChange={(e) => onChange(e.target.value)}
            >
              {column.options?.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "multiSelect": {
        const selected = Array.isArray(value) ? (value as string[]) : [];
        return (
          <FormControl
            size='small'
            fullWidth
          >
            <InputLabel>Values</InputLabel>
            <Select<string[]>
              multiple
              value={selected}
              label='Values'
              onChange={(e) => onChange(e.target.value as string[])}
              renderValue={(sel) => sel.join(", ")}
            >
              {column.options?.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                >
                  <Checkbox
                    checked={selected.includes(opt.value)}
                    size='small'
                  />
                  <ListItemText primary={opt.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }

      default:
        return (
          <TextField
            size='small'
            label='Value'
            value={localValue}
            onChange={handleTextChange}
            fullWidth
          />
        );
    }
  },
);

DynamicInput.displayName = "DynamicInput";
