import employeesData from "../mock/employees.json";
import { Employee } from "../pages/EmployeesTable";

export const fetchEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(employeesData as Employee[]);
    }, 600);
  });
};
