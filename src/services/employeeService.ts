import employeesData from "../mock/employees.json";
import { Employee } from "../config/employeeColumns";

export const fetchEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(employeesData as Employee[]);
    }, 600);
  });
};
