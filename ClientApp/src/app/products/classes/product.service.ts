import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, flatMap } from 'rxjs/operators';
import { Product } from './product';

@Injectable({ providedIn: 'root' })

export class ProductService {

    constructor(private http: HttpClient) { }

    get() {
        console.log('\n' + 'Getting products')
        return this.http.get<Product[]>('/api/product/get')
    }

    getProduct(id: number) {
        return this.get().pipe(flatMap(result => result), first(product => product.productId === id))
    }

    addProduct(product: Product) {
        return this.http.post<Product>('/api/product/addProduct', product);
    }

    updateProduct(id: number, product: Product) {
        return this.http.put<Product>('/api/product/updateProduct/' + id, product);
    }

    deleteProduct(id: number) {
        return this.http.delete<Product>('api/product/deleteProduct/' + id);
    }

}
