import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ProductsComponent } from './products/products.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from 'src/guards/auth-guard.service';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        ProductsComponent
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
            { path: 'products', component: ProductsComponent, canActivate: [AuthGuardService] },
            { path: '**', redirectTo: '/' }
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
