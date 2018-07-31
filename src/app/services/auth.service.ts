import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService implements CanActivate {
  isLoggedIn = false;
  user: any;
  private token: any;

  constructor(private http: HttpClient,
    private router: Router) {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.token = localStorage.getItem('token');
      this.isLoggedIn = true;
    }
  }

  getLoggedInUser() {
    return this.user;
  }

  setLoggedInUser(user){
    this.user = user;
  }

  canActivate() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }

  signup(params) {
    return this.http.post(`${environment.API_HOST}/web/advertiser/signup`, params)
      .map((response) => {
        return response;
      });
  }

  login(params) {
    return this.http.post(`${environment.API_HOST}/web/advertiser/login`, params)
      .map((response) => {
        if (response['success']) {
          this.isLoggedIn = true;
          this.setLocalStorage(response);
        }
        return response;
      });
  }

  resetPassword(params) {
    return this.http.post(`${environment.API_HOST}/web/advertiser/reset-password`, params);
  }

  changePassword(params, userId) {
    return this.http.post(`${environment.API_HOST}/web/advertiser/change-password?userId=${userId}`, params)
      .map((response: any) => {
        return response;
      });
  }

  activateUser(userId, pin) {
    return this.http.post(`${environment.API_HOST}/web/advertiser/activate`, { userId, pin })
      .map((response: any) => {
        return response;
      });
  }

	getToken() {
		return this.token;
	}
  

  logout() {
    // Api is not implemented yet so currently working with clearing localStorage
    localStorage.clear();
    this.isLoggedIn = false;
    this.user = {};
    this.token = '';
    return true;
  }

  updatePassword(currentPassword, newPassword) {
    return this.http.post(`${environment.API_HOST}/web/advertiser/update-password?token=${this.getToken()}`,
     { 'current_password': currentPassword, 'new_password': newPassword })
      .map((response: any) => {
        return response;
      });
  }

  private setLocalStorage(response) {
    this.user = response.user;
    this.token = response.token;
    console.log(this.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
  }

}
