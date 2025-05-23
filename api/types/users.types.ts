export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "manager" | "user";
}
