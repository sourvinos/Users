import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/helpers/auth-guard.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ProductDetailsComponent } from './products/ui/product-details.component';
import { ProductListComponent } from './products/ui/product-list.component';
import { ProductUpdateComponent } from './products/ui/product-update.component';
import { RegisterComponent } from './register/register.component';
import { HttpInterceptor } from './helpers/http-interceptor';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ProductListComponent,
        ProductDetailsComponent,
        ProductUpdateComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'home', redirectTo: '/' },
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: 'forgotPassword', component: ForgotPasswordComponent },
            { path: 'products', component: ProductListComponent, canActivate: [AuthGuardService] },
            { path: 'products/:id', component: ProductDetailsComponent, canActivate: [AuthGuardService] },
            { path: '**', redirectTo: '/' }
        ])
    ],
    providers: [AuthGuardService, { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true }],
    bootstrap: [AppComponent]
})

export class AppModule { }
