import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';


@Injectable()
export class UserService {

  user: any;
  token: any;
  playerForceBalance: any;

  constructor(
    private http: HttpClient,
    private ruoter: Router,
    private auth: AuthService
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.token = localStorage.getItem('token');
    }
  }

  getUser(){
    let playerData = this.http.get(`${environment.API_HOST}/web/advertiser?token=${this.token}`)
    .map(response => response);
    return playerData;
  }


}
