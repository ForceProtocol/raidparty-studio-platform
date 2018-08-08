import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../public/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CampaignsComponent } from '../campaigns/campaigns.component';
import { WalletComponent } from '../wallet/wallet.component';
import { StartCampaignComponent } from '../start-campaign/start-campaign.component';
import { SideNavbarComponent } from '../side-navbar/side-navbar.component';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { ActivateAccountComponent } from '../auth/activate-account/activate-account.component';
import { AuthService } from '../services/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'activate', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthService] },
  { path: 'campaigns', component: CampaignsComponent, canActivate: [AuthService] },
  { path: 'wallet', component: WalletComponent, canActivate: [AuthService] },
  { path: 'start-campaign/:gameId', component: StartCampaignComponent, canActivate: [AuthService] },
  { path: 'start-campaign/:gameId/:gameAdAssetId', component: StartCampaignComponent, canActivate: [AuthService] },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
