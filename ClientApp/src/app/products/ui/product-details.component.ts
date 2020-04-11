import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../classes/product.service';
import { Product } from '../classes/product';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html'
})

export class ProductDetailsComponent {

    productId: number
    product: Product

    form = this.formBuilder.group({
        productId: '',
        name: ['']
    })

    constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {
        this.activatedRoute.params.subscribe(p => {
            this.productService.getProduct(p[0]).subscribe(result => {
                console.log(result)
                // this.form.setValue({
                //     productId: result.productId,
                //     name: result.name
                // })
            })
        })
    }

}
