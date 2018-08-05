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


  updateCampaign(gameAdAssetId,params){
    let campaignData = this.http.post(`${environment.API_HOST}/web/advertiser/update-campaign/${gameAdAssetId}?token=${this.token}`,params)
    .map(response => response);
    return campaignData;
  }


  /**
  * Get all game ad assets (advertisers campaigns)
  */
  getGameAdCampaigns(active,archived){
    return this.http.get(`${environment.API_HOST}/web/advertiser/campaigns?token=${this.token}&active=${active}&archived=${archived}`)
    .map(response => response);
  }


  /**
  * Get an individual game ad asset (advertisers campaign)
  */
  getGameAdAsset(gameAdAssetId){
    return this.http.get(`${environment.API_HOST}/web/advertiser/campaign/${gameAdAssetId}?token=${this.token}`)
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

  deleteFile(campaignId,fileKey){
    return this.http.post(`${environment.API_HOST}/web/advertiser/campaign/file/delete?token=${this.token}`,{campaignId: campaignId,fileKey:fileKey})
    .map(response => response);
  }


}
