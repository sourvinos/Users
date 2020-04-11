import { Component, OnInit } from '@angular/core';
import { ProductService } from '../classes/product.service';
import { Product } from '../classes/product';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-products',
    templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit {

    products: Product[];
    constructor(private productService: ProductService, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.productService.get().subscribe(result => {
            this.products = result
            console.log('Product count ' + this.products.length)
        })
    }
}
