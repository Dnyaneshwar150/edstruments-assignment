import React, { useState, useCallback } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  IconButton,
  Badge,
  Box,
} from "@mui/material";
import { Filter } from "lucide-react";
import { ColumnConfig, SortConfig } from "../../types/table";
import { FilterCondition, FilterValue } from "../../types/filters";
import { FilterPopover } from "./FilterPopover";

interface TableHeaderProps {
  columns: ColumnConfig[];
  sort: SortConfig | null;
  onSort: (field: string) => void;
  filters: FilterCondition[];
  onApplyFilter: (field: string, operator: string, value: FilterValue) => void;
  onRemoveFilter: (id: string) => void;
  onClearFieldFilters: (field: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = React.memo(
  ({
    columns,
    sort,
    onSort,
    filters,
    onApplyFilter,
    onRemoveFilter,
    onClearFieldFilters,
  }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [activeColumn, setActiveColumn] = useState<ColumnConfig | null>(null);

    const handleFilterClick = useCallback(
      (event: React.MouseEvent<HTMLElement>, column: ColumnConfig) => {
        setAnchorEl(event.currentTarget);
        setActiveColumn(column);
      },
      [],
    );

    const handleClose = useCallback(() => {
      setAnchorEl(null);
      setActiveColumn(null);
    }, []);

    const getFieldFilterCount = (field: string): number => {
      return filters.filter((f) => f.field === field).length;
    };

    const getFieldFilters = (field: string): FilterCondition[] => {
      return filters.filter((f) => f.field === field);
    };

    return (
      <>
        <TableHead>
          <TableRow>
            {columns.map((column) => {
              const filterCount = getFieldFilterCount(column.key);
              return (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    minWidth: column.minWidth,
                    bgcolor: "background.paper",
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    py: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {column.sortable ? (
                      <TableSortLabel
                        active={sort?.field === column.key}
                        direction={
                          sort?.field === column.key ? sort.direction : "asc"
                        }
                        onClick={() => onSort(column.key)}
                        sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}

                    {column.filterable && (
                      <IconButton
                        size='small'
                        onClick={(e) => handleFilterClick(e, column)}
                        sx={{
                          ml: 0.5,
                          p: 0.4,
                          color:
                            filterCount > 0 ? "primary.main" : "text.disabled",
                          "&:hover": {
                            color: "primary.main",
                            bgcolor: "rgba(99, 102, 241, 0.08)",
                          },
                        }}
                      >
                        <Badge
                          badgeContent={filterCount}
                          color='primary'
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "0.6rem",
                              height: 14,
                              minWidth: 14,
                            },
                          }}
                        >
                          <Filter size={14} />
                        </Badge>
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        {activeColumn && (
          <FilterPopover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            column={activeColumn}
            existingFilters={getFieldFilters(activeColumn.key)}
            onApply={onApplyFilter}
            onRemove={onRemoveFilter}
            onClearField={onClearFieldFilters}
          />
        )}
      </>
    );
  },
);

TableHeader.displayName = "TableHeader";
