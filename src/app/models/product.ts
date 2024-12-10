import { ProductImage } from "./product.image";
export interface Product {
    id: number;
    name: string;
    price: number;
    thumbnail: string;
    description: string;
    category_id: number;
    url: string;
    created_at: string; // Add this field
    updated_at: string; // Add this field
    product_images: ProductImage[];
}