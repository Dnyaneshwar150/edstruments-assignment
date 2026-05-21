import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { employeeColumns, Employee } from "../config/employeeColumns";
import { fetchEmployees } from "../services/employeeService";
import { useFilters } from "../hooks/useFilters";
import { CustomTable } from "../components/CustomTable/CustomTable";

export const EmployeesTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees().then((data) => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  const {
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    clearFieldFilters,
    paginatedData,
    sort,
    handleSort,
    page,
    rowsPerPage,
    totalRows,
    handlePageChange,
    handleRowsPerPageChange,
    exportCSV,
  } = useFilters(employees, employeeColumns);

  return loading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <CustomTable<Employee>
        columns={employeeColumns}
        data={paginatedData}
        loading={loading}
        title='Employees'
        filters={filters}
        onApplyFilter={addFilter}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
        onClearFieldFilters={clearFieldFilters}
        sort={sort}
        onSort={handleSort}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onExportCSV={exportCSV}
      />
    </Box>
  );
};
