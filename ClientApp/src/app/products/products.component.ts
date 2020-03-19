import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html'
})

export class ProductsComponent implements OnInit {

    products: Product[] = []

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.get().subscribe(result => {
            this.products = result
            console.log(this.products)
        });
    }

}
