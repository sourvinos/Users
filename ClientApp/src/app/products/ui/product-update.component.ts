import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-product-update',
    templateUrl: './product-update.component.html'
})

export class ProductUpdateComponent implements OnInit {

    insertForm: FormGroup;

    name: FormControl;
    description: FormControl;
    price: FormControl;

    constructor() { }

    ngOnInit() { }

}
