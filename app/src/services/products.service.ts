import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/models/product';
import { ApiResponse } from 'src/models/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  API_URL = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL + '?skip=0&limit=10');
  }

  searchProducts(query: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL + '/search?q=' + query);
  }

  pagedProducts(num: number): Observable<ApiResponse> {
    let skip = 0;
    if (num === 2) {
      skip = 10;
    } else if (num === 3) {
      skip = 20;
    } else {
      skip = 0;
    }
    return this.http.get<ApiResponse>(
      this.API_URL + '?skip=' + skip + '&limit=10'
    );
  }
}
