import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable()
export class GameAdAssetService {
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

  createCampaign(params){
    console.log("params sent to createcampaign: ",params);
    let campaignData = this.http.post(`${environment.API_HOST}/web/advertiser/create-campaign?token=${this.token}`,params)
    .map(response => response);
    return campaignData;
  }


  getGameAdCampaigns(){
    return this.http.get(`${environment.API_HOST}/web/advertiser/campaigns?token=${this.token}`)
    .map(response => response);
  }


  deleteCampaign(campaignId){
    return this.http.post(`${environment.API_HOST}/web/advertiser/campaign/delete?token=${this.token}`,{campaignId: campaignId})
    .map(response => response);
  }


}
