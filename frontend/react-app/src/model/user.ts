type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
    username: string;
    firstName: string;
    lastName: string;
    address: string;
    role: UserRole;
}