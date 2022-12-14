import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Product } from 'src/models/product';
import { SortColumn, SortDirection, SortEvent } from 'src/models/sortevent';
import { ProductsService } from 'src/services/products.service';

const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: 'asc',
  '': 'asc',
};

const compare = (param1: string | number, param2: string | number) =>
  param1 < param2 ? -1 : param1 > param2 ? 1 : 0;

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

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
    this.mapAndSliceProducts(productsFromLocalStorage);
  }

  mapAndSliceProducts(products: any) {
    this.products = products
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

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    let productsCollection = JSON.parse(
      localStorage.getItem('products') as string
    );

    let pagedCollection = productsCollection
      .map((product: any, i: number) => ({ id: i + 1, ...product }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );

    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.products = pagedCollection;
    } else {
      this.products = [...pagedCollection].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
