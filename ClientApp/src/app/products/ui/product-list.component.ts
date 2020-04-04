import { Component, OnInit } from '@angular/core';
import { ProductService } from '../classes/product.service';
import { Product } from '../classes/product';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-products',
    templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit {

    products$: Observable<Product[]>;
    products: Product[];
    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.products$ = this.productService.get()
        this.products$.subscribe(result => { this.products = result; });
    }

}
