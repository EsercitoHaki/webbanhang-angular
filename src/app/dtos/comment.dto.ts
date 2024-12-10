export class CommentDTO {
  content: string;
  product_id: number;
  user_id: number;
  parent_id?: number | null;

  constructor(product_id: number, user_id: number, content: string, parent_id: number | null) {
    this.product_id = product_id;
    this.user_id = user_id;
    this.content = content;
    this.parent_id = parent_id;
  }
}