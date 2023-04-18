import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'

  // inject HttpClient
  constructor(private httpClient : HttpClient) { }

  // map the JSON data from the spring Data REST to Product array
  getProductList() : Observable<Product[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products) // map response to our data type
    );
  }
}


  interface GetResponse {
    _embedded : {
      products : Product[];
    }
  }

