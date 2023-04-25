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
    return this.getProducts(searchUrl);
  }
  
  getProductCategories(): Observable<ProductCategory[]> {
		return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
						map(response => response._embedded.productCategory)
					);
	}

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);
  }


  getProduct(productId: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }  

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)  // map response to our data type
    );
  }

  getProductListPaginate(pageNumber: number,
                         pageSize: number,
                         categoryId : number) : Observable<GetResponseProducts> {
    const url = `${this.baseUrl}/search/findByCategoryId` 
                + `?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

}

interface GetResponseProducts {
  _embedded : {
    products : Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
    }
  }

interface GetResponseProductCategory {
  _embedded : {
    productCategory : ProductCategory[];
  }
}

