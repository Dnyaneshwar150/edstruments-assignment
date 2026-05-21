import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { fetchEmployees } from "../services/employeeService";
import { useFilters } from "../hooks/useFilters";
import { CustomTable } from "../components/CustomTable/CustomTable";
import { formatCurrency, formatDate } from "../utils/helper";
import { ColumnConfig } from "../types/table";
export interface Employee {
  [key: string]: unknown;
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  skills: string[];
  address: {
    city: string;
    state: string;
    country: string;
  };
  projects: number;
  performanceRating: number;
}

export const EmployeesTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees().then((data) => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  const employeeColumns: ColumnConfig<Employee>[] = [
    {
      key: "name",
      label: "Name",
      type: "text",
      sortable: true,
      filterable: true,
      minWidth: 160,
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      sortable: true,
      filterable: true,
      minWidth: 220,
    },
    {
      key: "department",
      label: "Department",
      type: "select",
      sortable: true,
      filterable: true,
      minWidth: 140,
      options: [
        { value: "Engineering", label: "Engineering" },
        { value: "Design", label: "Design" },
        { value: "Marketing", label: "Marketing" },
        { value: "Sales", label: "Sales" },
        { value: "HR", label: "HR" },
        { value: "Finance", label: "Finance" },
        { value: "Operations", label: "Operations" },
        { value: "Legal", label: "Legal" },
      ],
    },
    {
      key: "role",
      label: "Role",
      type: "text",
      sortable: true,
      filterable: true,
      minWidth: 180,
    },
    {
      key: "salary",
      label: "Salary",
      type: "number",
      sortable: true,
      filterable: true,
      minWidth: 120,
      format: (value) => formatCurrency(value),
    },
    {
      key: "joinDate",
      label: "Join Date",
      type: "date",
      sortable: true,
      filterable: true,
      minWidth: 130,
      format: (value) => formatDate(value),
    },
    {
      key: "isActive",
      label: "Active",
      type: "boolean",
      sortable: true,
      filterable: true,
      minWidth: 90,
    },
    {
      key: "skills",
      label: "Skills",
      type: "multiSelect",
      sortable: false,
      filterable: true,
      minWidth: 200,
      options: [
        { value: "React", label: "React" },
        { value: "TypeScript", label: "TypeScript" },
        { value: "Node.js", label: "Node.js" },
        { value: "Python", label: "Python" },
        { value: "Java", label: "Java" },
        { value: "Go", label: "Go" },
        { value: "SQL", label: "SQL" },
        { value: "AWS", label: "AWS" },
        { value: "Docker", label: "Docker" },
        { value: "Kubernetes", label: "Kubernetes" },
        { value: "GraphQL", label: "GraphQL" },
        { value: "Figma", label: "Figma" },
        { value: "SEO", label: "SEO" },
        { value: "Analytics", label: "Analytics" },
        { value: "Communication", label: "Communication" },
      ],
    },
    {
      key: "address.city",
      label: "City",
      type: "text",
      sortable: true,
      filterable: true,
      minWidth: 120,
    },
    {
      key: "projects",
      label: "Projects",
      type: "number",
      sortable: true,
      filterable: true,
      minWidth: 100,
    },
    {
      key: "performanceRating",
      label: "Rating",
      type: "number",
      sortable: true,
      filterable: true,
      minWidth: 90,
      format: (value) =>
        value != null ? String(Number(value).toFixed(1)) : "",
    },
  ];

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
