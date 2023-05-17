import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;
  
  cartItemStorageKey: string = 'cartItems';

  constructor() {

    let storedValues = this.storage.getItem(this.cartItemStorageKey) ?? '';
    if (storedValues != '') {
      let data = JSON.parse(storedValues);
      if (data != null) {
        this.cartItems = data;
        this.computeCartTotals();
      }
  
    }


  }

  addToCart(cartItemToAdd: CartItem) {
    
    let alreadyExistsInCart: boolean = false;
    let exitingCartItem: CartItem = undefined!;

    if (!this.isCartEmpty()) {
      exitingCartItem = this.cartItems.find(cartItem => cartItem.id == cartItemToAdd.id)!;
      alreadyExistsInCart = (exitingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      ++exitingCartItem.quantity;
    } else {
      this.cartItems.push(cartItemToAdd);
    }

    this.computeCartTotals();

  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuanityValue: number = 0;

    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuanityValue += cartItem.quantity;
    }
    // calling .next() publishes the values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuanityValue);

    this.logCartData(totalPriceValue, totalQuanityValue);
    this.persistCartItems();

  }

  persistCartItems() {
    this.storage.setItem(this.cartItemStorageKey, JSON.stringify(this.cartItems));
  }

  logCartData(totaPriceValue: number, totalQuantityValue: number) {
    console.log(`contents of the cart`);
    for (let cartItem of this.cartItems) {
      const subtotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name}, quantity: ${cartItem.quantity}, unitPrice: ${cartItem.unitPrice}, subtotalPrice: ${subtotalPrice}`)
    }
    console.log(`totalPrice: ${totaPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue.toFixed(2)}`);
  }

  isCartEmpty() {
    return this.cartItems.length == 0;
  }

  removeFromCart(cartItem: CartItem) {
    --cartItem.quantity;
    
    if (cartItem.quantity == 0) {
      this.removeItemFromCart(cartItem);
    } else {
      this.computeCartTotals();
    }

  }
  
  removeItemFromCart(cartItemToRemove: CartItem) {
    let cartItemToRemoveIndex = this.cartItems.findIndex(cartItem => cartItem.id == cartItemToRemove.id)!;

    if (cartItemToRemoveIndex > -1) {
      this.cartItems.splice(cartItemToRemoveIndex, 1);
      this.computeCartTotals();
    }
  }

}