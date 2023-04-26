import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;

  // pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyWord: string = "";

  // ProductService
  // ActiatedRoute - Current active route that loaded the component. Useful for accessing route parameters.
  // will help in fetching categoryId
  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {}

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

    if (keyword != this.previousKeyWord) {
      this.pageNumber = 1;
    }

    this.previousKeyWord = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`)

    this.productService.searchProductsPaginate(this.pageNumber - 1,
                                               this.pageSize, 
                                               keyword)
                                              .subscribe(this.processResult());
  }

  processResult() {
    return (data : any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
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

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    this.productService.getProductListPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    console.log(`adding product:${product} to cart`);
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
