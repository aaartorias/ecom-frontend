import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  

  // private baseUrl = 'http://localhost:8080/api/products?size=100'
  private baseUrl = 'http://localhost:8080/api/products'
  private categoryUrl = 'http://localhost:8080/api/product-category'

  // inject HttpClient
  constructor(private httpClient : HttpClient) { }

  // map the JSON data from the spring Data REST to Product array
  // getProductList() : Observable<Product[]> {
  //   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
  //     map(response => response._embedded.products) // map response to our data type
  //   );
  // } 
  // }

  getProductList(categoryId : number) : Observable<Product[]> {
    // console.log(`get product list + ${categoryId}`);
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    // console.log(`search Url ${searchUrl}`)
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products) // map response to our data type
    );
  }
  
  // getProductCategories() : Observable<ProductCategory[]>{
  //   console.log("calling get product categories");
  //   return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
  //     map(response => response._embedded.productCategory)
  //   );
  // }
  getProductCategories(): Observable<ProductCategory[]> {
		return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
						map(response => response._embedded.productCategory)
					);
	}
  
}

  interface GetResponseProducts {
    _embedded : {
      products : Product[];
    }
  }

  interface GetResponseProductCategory {
    _embedded : {
      productCategory : ProductCategory[];
    }
  }
