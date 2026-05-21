import { useState, useMemo, useCallback } from "react";
import { FilterCondition, FilterValue } from "../types/filters";
import { ColumnConfig, SortConfig } from "../types/table";
import { applyFilters } from "../engine/applyFilters";
import { generateFilterId, getNestedValue } from "../utils/helper";

const STORAGE_KEY = "custom-table-filters";

const loadFilters = (): FilterCondition[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFilters = (filters: FilterCondition[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // silently fail
  }
};

export const useFilters = <T extends Record<string, unknown>>(
  data: T[],
  columns: ColumnConfig<T>[],
) => {
  const [filters, setFilters] = useState<FilterCondition[]>(loadFilters);
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const addFilter = useCallback(
    (field: string, operator: string, value: FilterValue) => {
      setFilters((prev) => {
        const updated = [
          ...prev,
          { id: generateFilterId(), field, operator, value },
        ];
        saveFilters(updated);
        return updated;
      });
      setPage(0);
    },
    [],
  );

  const updateFilter = useCallback(
    (id: string, updates: Partial<Omit<FilterCondition, "id">>) => {
      setFilters((prev) => {
        const updated = prev.map((f) =>
          f.id === id ? { ...f, ...updates } : f,
        );
        saveFilters(updated);
        return updated;
      });
      setPage(0);
    },
    [],
  );

  const removeFilter = useCallback((id: string) => {
    setFilters((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      saveFilters(updated);
      return updated;
    });
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    saveFilters([]);
    setPage(0);
  }, []);

  const clearFieldFilters = useCallback((field: string) => {
    setFilters((prev) => {
      const updated = prev.filter((f) => f.field !== field);
      saveFilters(updated);
      return updated;
    });
    setPage(0);
  }, []);

  const filteredData = useMemo(
    () => applyFilters(data, filters, columns),
    [data, filters, columns],
  );

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sort.field);
      const bVal = getNestedValue(b, sort.field);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : typeof aVal === "string" && typeof bVal === "string"
          ? aVal.localeCompare(bVal)
          : String(aVal).localeCompare(String(bVal));

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sort]);

  const paginatedData = useMemo(
    () =>
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage],
  );

  const handleSort = useCallback((field: string) => {
    setSort((prev) => {
      if (prev?.field === field) {
        if (prev.direction === "asc")
          return { field, direction: "desc" as const };
        return null; // Third click removes sort
      }
      return { field, direction: "asc" as const };
    });
  }, []);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  const exportCSV = useCallback(() => {
    /** Safely escape a CSV cell value */
    const escapeCell = (val: unknown): string => {
      if (val == null) return "";
      const str = Array.isArray(val)
        ? val.join("; ") // semicolon separator avoids comma-splitting
        : String(val);
      // Wrap in quotes if contains comma, quote, or newline
      if (str.includes('"') || str.includes(",") || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = columns.map((c) => escapeCell(c.label)).join(",");
    const rows = filteredData.map((row) =>
      columns
        .map((col) => {
          const val = getNestedValue(row, col.key);
          // Use format fn if available (e.g. currency, date), but never for arrays
          const formatted =
            col.format && !Array.isArray(val) ? col.format(val) : val;
          return escapeCell(formatted);
        })
        .join(","),
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredData, columns]);

  return {
    filters,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    clearFieldFilters,
    filteredData,
    sortedData,
    paginatedData,
    sort,
    handleSort,
    page,
    rowsPerPage,
    totalRows: sortedData.length,
    handlePageChange,
    handleRowsPerPageChange,
    exportCSV,
  };
};
