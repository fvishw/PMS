import IOption from "@/types/option";

const roles: IOption[] = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "employee",
    label: "Employee",
  },
];

const parentRoleMapper: { [key: string]: string } = {
  employee: "manager",
  manager: "admin",
  admin: "admin",
};

export { roles, parentRoleMapper };
