import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {
  
  products: Product[] = [];

  constructor(private productService: ProductService ) {}

  ngOnInit(): void {
    this.listProducts();
  }
  
  listProducts() {
    // getProductList() is invoked once it is subscribed.
    // which executes in asynchronus fashion
    // we assign the returned data to our product array.
    this.productService.getProductList().subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
