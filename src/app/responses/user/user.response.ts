import { Role } from "../../models/role";

export interface UserResponse {
    id: string;
    fullname: string;
    email: string;
    picture: string;
    address?: string;
    date_of_birth?: Date;
    is_active: boolean;
    facebook_account_id: number;
    google_account_id: string;
    role: Role;
}