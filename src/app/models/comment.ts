import { User } from "./user";

export interface Comment {
    id: number;
    user: User | null;
    content: string;
    created_at: Date; 
}