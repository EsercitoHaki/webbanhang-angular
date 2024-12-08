import { Role } from "./role";

export interface User {
    id: number;
    fullname: string;
    phone_number: string;
    address: string;
    is_active: boolean;
    date_of_birth: number;
    facebook_account_id: number;
    google_account_id: number;
    role: Role;
}