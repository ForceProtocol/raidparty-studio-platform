import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './services/app.interceptor';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { GameService } from './services/game.service';
import { GameAdAssetService } from './services/game-ad-asset.service';
import { EventService } from './services/eventEmitter.service';
import { NotificationService } from './services/notification.service';
import { HelperService } from './services/helper.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';


import { HomeComponent } from './public/home.component';
import { FooterComponent } from './headers/footer/footer.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { WalletComponent } from './wallet/wallet.component';
import { CreateGameComponent } from './game/create.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';
import { NgTempusdominusBootstrapModule } from 'ngx-tempusdominus-bootstrap';

import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { ReCaptchaModule } from 'angular2-recaptcha';

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    FooterComponent,
    SideNavbarComponent,
    TopNavbarComponent,
    DashboardComponent,
    CampaignsComponent,
    WalletComponent,
    CreateGameComponent,
    ActivateAccountComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    FormsModule,
    NgTempusdominusBootstrapModule,
    FileUploadModule,
    ReCaptchaModule
  ],
  providers: [AuthService, UserService, GameService, GameAdAssetService, EventService, NotificationService, NgxSmartModalService, HelperService,CanDeactivateGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
