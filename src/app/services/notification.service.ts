import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';


@Injectable()
export class NotificationService {

  user: any;
  token: any;

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

  getUserNotifications() {
    return this.http.get(`${environment.API_HOST}/web/advertiser/notifications?token=${this.auth.getToken()}`)
      .map(response => response);
  }

  deleteNotification(notificationId) {
    return this.http.post(`${environment.API_HOST}/web/advertiser/notification/delete?token=${this.auth.getToken()}`
      , { notification_id: notificationId })
      .map(response => response);
  }

}
