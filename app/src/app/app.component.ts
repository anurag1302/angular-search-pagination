import { Component, OnInit } from '@angular/core';
import { Product } from 'src/models/product';
import { ProductsService } from 'src/services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  collectionSize = 0;
  pageSize = 5;

  constructor(private productsService: ProductsService) {}
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe((x) => {
      this.products = x.products;
      this.collectionSize = x.products.length;
      localStorage.setItem('products', JSON.stringify(x.products));
      this.refreshProducts();
    });
  }

  refreshProducts() {
    let productsFromLocalStorage = JSON.parse(
      localStorage.getItem('products') as string
    );
    this.products = productsFromLocalStorage
      .map((product: any, i: number) => ({ id: i + 1, ...product }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }

  search(event: any) {
    let searchText = event.target.value;
    this.productsService.searchProducts(searchText).subscribe((x) => {
      this.products = x.products;
      this.collectionSize = x.products.length;
      localStorage.setItem('products', JSON.stringify(x.products));
      this.refreshProducts();
    });
  }
}
