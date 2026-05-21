import React from "react";
import {
  Table,
  TableContainer,
  Paper,
  TablePagination,
  Box,
} from "@mui/material";
import { ColumnConfig, SortConfig } from "../../types/table";
import { FilterCondition, FilterValue } from "../../types/filters";
import { TableHeader } from "./TableHeader";
import { CustomTableBody } from "./TableBody";
import { FilterChip } from "./FilterChip";
import { TableHeading } from "./TableHeading";

interface CustomTableProps<T extends Record<string, unknown>> {
  columns: ColumnConfig<T>[];
  data: T[];
  loading?: boolean;
  title?: string;
  // Filter props
  filters: FilterCondition[];
  onApplyFilter: (field: string, operator: string, value: FilterValue) => void;
  onRemoveFilter: (id: string) => void;
  onClearFilters: () => void;
  onClearFieldFilters: (field: string) => void;
  // Sort props
  sort: SortConfig | null;
  onSort: (field: string) => void;
  // Pagination props
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportCSV?: () => void;
}

function CustomTableInner<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  title,
  filters,
  onApplyFilter,
  onRemoveFilter,
  onClearFilters,
  onClearFieldFilters,
  sort,
  onSort,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  onExportCSV,
}: CustomTableProps<T>) {
  const columnMap = new Map(columns.map((c) => [c.key, c]));

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <TableHeading
        title={title}
        totalRows={totalRows}
        filters={filters}
        onClearFilters={onClearFilters}
        onExportCSV={onExportCSV}
      />

      {filters.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            px: 3,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              filter={filter}
              column={columnMap.get(filter.field) as ColumnConfig | undefined}
              onRemove={onRemoveFilter}
            />
          ))}
        </Box>
      )}

      {/* ── Table ── */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table
          stickyHeader
          size='small'
        >
          <TableHeader
            columns={columns as ColumnConfig[]}
            sort={sort}
            onSort={onSort}
            filters={filters}
            onApplyFilter={onApplyFilter}
            onRemoveFilter={onRemoveFilter}
            onClearFieldFilters={onClearFieldFilters}
          />
          <CustomTableBody
            data={data}
            columns={columns}
            loading={loading}
          />
        </Table>
      </TableContainer>

      {/* ── Pagination ── */}
      <TablePagination
        component='div'
        count={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      />
    </Paper>
  );
}

export const CustomTable = React.memo(
  CustomTableInner,
) as typeof CustomTableInner;
