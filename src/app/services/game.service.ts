import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';


@Injectable()
export class GameService {

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

  getActiveGames(){
    let gameData = this.http.get(`${environment.API_HOST}/web/advertiser-games?token=${this.token}`)
    .map(response => response);
    return gameData;
  }

  getGame(gameId){
    let gameData = this.http.get(`${environment.API_HOST}/game/${gameId}?token=${this.token}`)
    .map(response => response);
    return gameData;
  }

  getGameAssets(gameId){
    let gameData = this.http.get(`${environment.API_HOST}/game/game-assets/${gameId}?token=${this.token}`)
    .map(response => response);
    return gameData;
  }


  addGame(params) {
    return this.http.post(`${environment.API_HOST}/studio/game?token=${this.token}`, params)
      .map((response) => {
        return response;
      });
  }

  updateGame(params,gameId) {
    return this.http.post(`${environment.API_HOST}/studio/game/${gameId}?token=${this.token}`, params)
      .map((response) => {
        return response;
      });
  }


  pauseCampaigns(gameId) {
    return this.http.post(`${environment.API_HOST}/studio/game/adverts/pause?token=${this.token}`, {gameId:gameId})
      .map((response) => {
        return response;
      });
  }


  deleteGame(gameId){
    return this.http.post(`${environment.API_HOST}/studio/game/delete?token=${this.token}`,{gameId: gameId})
    .map(response => response);
  }

  archiveGame(gameId,archiveState){
    return this.http.post(`${environment.API_HOST}/studio/game/archive?token=${this.token}`,{gameId: gameId, archived:archiveState})
    .map(response => response);
  }

  activateGame(gameAdAssetId,activeState){
    return this.http.post(`${environment.API_HOST}/studio/game/activate?token=${this.token}`,{gameAdAssetId: gameAdAssetId, active:activeState})
    .map(response => response);
  }

  deleteFile(gameId,fileKey){
    return this.http.post(`${environment.API_HOST}/studio/game/file/delete?token=${this.token}`,{gameId: gameId,fileKey:fileKey})
    .map(response => response);
  }

}
