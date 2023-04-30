import { CartItem } from "./cart-item";

export class OrderItem {
    // productId: string;
    productId: number;
    unitPrice: number;
    quantity: number;
    imageUrl: string;

    constructor(cartItem: CartItem) {
        this.productId = cartItem.id;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.imageUrl = cartItem.imageUrl;
    }

}
