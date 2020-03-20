import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, flatMap, shareReplay } from 'rxjs/operators';
import { Product } from './product';

@Injectable({ providedIn: 'root' })

export class ProductService {

    private products: Observable<Product[]>;

    constructor(private http: HttpClient) { }

    get() {
        if (!this.products) {
            this.products = this.http.get<Product[]>('/api/product/get').pipe(shareReplay());
        }
        return this.products;
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

    /**
     * Caller(s)
     *  nav-menu.component - logout()
     * Description
     *  Clears the browser's cached products
     */
    clearCache() {
        this.products = null;
    }

}
