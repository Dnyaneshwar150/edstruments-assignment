import React from "react";
import {
  TableBody as MuiTableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Skeleton,
  Chip,
} from "@mui/material";
import { SearchX } from "lucide-react";
import { ColumnConfig } from "../../types/table";
import { getNestedValue } from "../../utils/helper";

interface TableBodyProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
}

function TableBodyInner<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
}: TableBodyProps<T>) {
  if (loading) {
    return (
      <MuiTableBody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <TableRow key={idx}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                <Skeleton
                  variant='text'
                  animation='wave'
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </MuiTableBody>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell colSpan={columns.length}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <SearchX
                size={48}
                strokeWidth={1.5}
              />
              <Typography
                variant='h6'
                sx={{ mt: 2, fontWeight: 500 }}
              >
                No results found
              </Typography>
              <Typography
                variant='body2'
                sx={{ mt: 0.5 }}
              >
                Try adjusting your filters to find what you're looking for.
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      </MuiTableBody>
    );
  }

  const renderCellValue = (
    column: ColumnConfig<T>,
    row: T,
  ): React.ReactNode => {
    const value = getNestedValue(row as Record<string, unknown>, column.key);

    if (column.render) {
      return column.render(value, row);
    }

    if (column.format) {
      return column.format(value);
    }

    if (Array.isArray(value)) {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value.slice(0, 3).map((item, i) => (
            <Chip
              key={i}
              label={String(item)}
              size='small'
              variant='outlined'
              sx={{ fontSize: "0.75rem", borderRadius: "4px" }}
            />
          ))}
          {value.length > 3 && (
            <Chip
              label={`+${value.length - 3}`}
              size='small'
              sx={{ fontSize: "0.75rem", borderRadius: "4px" }}
            />
          )}
        </Box>
      );
    }

    if (typeof value === "boolean") {
      return (
        <Chip
          label={value ? "Active" : "Inactive"}
          size='small'
          color={value ? "success" : "default"}
          variant={value ? "filled" : "outlined"}
          sx={{ fontSize: "0.75rem" }}
        />
      );
    }

    return String(value ?? "\u2014");
  };

  return (
    <MuiTableBody>
      {data.map((row, rowIdx) => {
        const rowRecord = row as Record<string, unknown>;
        const rowKey =
          rowRecord.id != null ? String(rowRecord.id) : String(rowIdx);
        return (
          <TableRow
            key={rowKey}
            hover
            sx={{
              "&:last-child td": { borderBottom: 0 },
              transition: "background-color 0.15s ease",
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={column.key}
                sx={{
                  fontSize: "0.875rem",
                  py: 1.5,
                  whiteSpace:
                    column.type === "multiSelect" ? "normal" : "nowrap",
                }}
              >
                {renderCellValue(column, row)}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </MuiTableBody>
  );
}

export const CustomTableBody = React.memo(
  TableBodyInner,
) as typeof TableBodyInner;
