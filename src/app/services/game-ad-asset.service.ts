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
  * Get all game ad assets (advertisers adverts)
  */
  getGameAdverts(approved){
    return this.http.get(`${environment.API_HOST}/studio/game/adverts?token=${this.token}&approved=${approved}`)
    .map(response => response);
  }


  stopAdvert(advertId){
    return this.http.post(`${environment.API_HOST}/studio/game/advert/stop?token=${this.token}`,{gameAdAsset: advertId})
    .map(response => response);
  }

  approveAdvert(advertId){
    return this.http.post(`${environment.API_HOST}/studio/game/advert/approve?token=${this.token}`,{gameAdAsset: advertId})
    .map(response => response);
  }

  /**
  * Get an individual game ad asset (advertisers campaign)
  */
  getGameAdAsset(gameAdAssetId){
    /*return this.http.get(`${environment.API_HOST}/web/advertiser/campaign/${gameAdAssetId}?token=${this.token}`)
    .map(response => response);*/
  }


}
