import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { OperatorConfig } from "../../types/filters";

interface OperatorSelectorProps {
  operators: OperatorConfig[];
  value: OperatorConfig;
  onChange: (operator: OperatorConfig) => void;
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = React.memo(
  ({ operators, value, onChange }) => {
    const handleChange = (event: SelectChangeEvent<string>) => {
      const selected = operators.find((op) => op.value === event.target.value);
      if (selected) onChange(selected);
    };

    return (
      <FormControl
        size='small'
        fullWidth
      >
        <InputLabel>Operator</InputLabel>
        <Select
          value={value.value}
          label='Operator'
          onChange={handleChange}
        >
          {operators.map((op) => (
            <MenuItem
              key={op.value}
              value={op.value}
            >
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  },
);

OperatorSelector.displayName = "OperatorSelector";
