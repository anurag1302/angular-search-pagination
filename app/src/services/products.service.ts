import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from 'src/models/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  API_URL = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ApiResponse> {
    return this.http
      .get(this.API_URL)
      .pipe(map((response) => <ApiResponse>response));
  }

  searchProducts(query: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL + '/search?q=' + query);
  }
}
