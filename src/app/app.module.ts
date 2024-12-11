import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import {
  
  HTTP_INTERCEPTORS, 
  
} from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptors';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminModule } from './components/admin/admin.module';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './components/product/product.component';
import { GoogleSigninButtonComponent } from './google-signin-button/google-signin-button.component';


@NgModule({

  declarations: [    
    HomeComponent, 
    HeaderComponent,
    FooterComponent, 
    DetailProductComponent, 
    OrderComponent, 
    OrderDetailComponent, 
    LoginComponent, 
    RegisterComponent, 
    AppComponent, 
    UserProfileComponent, ProductComponent, GoogleSigninButtonComponent, 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AdminModule,
    SocialLoginModule
  ],
  providers: [provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('300458157401-lhpsaqtp4370qlo88gu8a9v8j8ia5pgc.apps.googleusercontent.com')  // Thay bằng Client ID của bạn
          }
        ]
      }
    }
  ],
  bootstrap: [
    AppComponent,
    //HomeComponent,
    //DetailProductComponent,
    //OrderComponent,
    //OrderDetailComponent,
    //LoginComponent,
    //RegisterComponent
  ]
})
export class AppModule { }