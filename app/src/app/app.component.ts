import { Component } from '@angular/core';
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
  values = '';

  constructor(private productsService: ProductsService) {
    this.productsService.getProducts().subscribe((data) => {
      this.products = data.products;
    });
  }

  onKey(event: any) {
    this.values = event.target.value;
    this.productsService.searchProducts(this.values).subscribe((data) => {
      console.log(data.products);
      this.products = data.products;
    });
  }

  pageClick(num: number) {
    this.productsService.pagedProducts(num).subscribe((data) => {
      this.products = data.products;
    });
  }
}
