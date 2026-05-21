import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { EmployeesTable } from "./pages/EmployeesTable";
import theme from "./theme";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EmployeesTable />
    </ThemeProvider>
  );
};

export default App;
