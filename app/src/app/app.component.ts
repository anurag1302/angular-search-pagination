import { Component } from '@angular/core';
import { Options } from 'src/models/apiresponse';
import { Product } from 'src/models/product';
import { ProductsService } from 'src/services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';
  products: Product[] = [];

  options: Options = {
    skip: 0,
    search: '',
    limit: 30,
  };

  constructor(private productsService: ProductsService) {
    this.pageClick(this.options.skip, this.options.limit);
  }

  get numbers(): number[] {
    const limit = Math.ceil(this.products.length / this.options.limit);
    return Array.from({ length: limit }, (_, i) => i + 1);
  }

  onKey(event: any) {
    let value = event.target.value;
    this.productsService.searchProducts(value).subscribe((data) => {
      this.products = data.products;
    });
  }

  pageClick(skip: number, limit: number) {
    this.productsService.pagedProducts(skip, limit).subscribe((data) => {
      this.products = data.products;
    });
  }

  size(limit: number) {
    this.options.limit = limit;
    this.options.skip = 0;
    this.pageClick(0, limit);
  }

  next() {
    this.options.skip = this.options.skip + this.options.limit;
    this.pageClick(this.options.skip, this.options.limit);
  }

  previous() {
    this.options.skip = this.options.skip - this.options.limit;
    this.pageClick(this.options.skip, this.options.limit);
  }
}
