import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId: number | undefined;
  currentCategoryName: string = "";
  searchMode: boolean = false;

  // ProductService
  // ActiatedRoute - Current active route that loaded the component. Useful for accessing route parameters.
  // will help in fetching categoryId
  constructor(private productService: ProductService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {
    const keyword : string = this.route.snapshot.paramMap.get("keyword")!;
    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    );

  }

  handleListProducts() {
    // getProductList() is invoked once it is subscribed.
    // which executes in asynchronus fashion
    // we assign the returned data to our product array.

    // check if "id" parameter is available
    const hasCategoryId :boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      console.log(`has category ${this.route.snapshot.paramMap.get('id')}`)
      // get the "id" param string. convert string to a number using the + symbol
      // ! tells compiler that object is not null. ! is the non-null operator
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      // default to 1
      console.log(`doesn't have category ${this.route.snapshot.url}` )
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books"
    }
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
