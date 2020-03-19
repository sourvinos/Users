import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class ProductService {

    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<any>('/api/product/get').pipe(map(result => {
            return result;
        }, (error: any) => {
            return error;
        }));
    }

}
