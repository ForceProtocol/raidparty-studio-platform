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
    let campaignData = this.http.post(`${environment.API_HOST}/web/advertiser/create-campaign?token=${this.token}`,params)
    .map(response => response);
    return campaignData;
  }


  getGameAdCampaigns(active,archived){
    return this.http.get(`${environment.API_HOST}/web/advertiser/campaigns?token=${this.token}&active=${active}&archived=${archived}`)
    .map(response => response);
  }


  deleteCampaign(campaignId){
    return this.http.post(`${environment.API_HOST}/web/advertiser/campaign/delete?token=${this.token}`,{campaignId: campaignId})
    .map(response => response);
  }

  archiveCampaign(campaignId,archiveState){
    return this.http.post(`${environment.API_HOST}/web/advertiser/campaign/archive?token=${this.token}`,{campaignId: campaignId, archived:archiveState})
    .map(response => response);
  }

  activateCampaign(gameAdAssetId,activeState){
    return this.http.post(`${environment.API_HOST}/web/advertiser/campaign/activate?token=${this.token}`,{gameAdAssetId: gameAdAssetId, active:activeState})
    .map(response => response);
  }


}
