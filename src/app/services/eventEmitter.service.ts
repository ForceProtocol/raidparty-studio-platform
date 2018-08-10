import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventService {
    private _listners = new Subject<any>();
    private gameFilter = new Subject<any>();
    private gameFilterValue: string;

    private gameCampaignFilter = new Subject<any>();
    private gameCampaignFilterValue: string;


    listen(): Observable<any> {
       return this._listners.asObservable();
    }


    /** GAME FILTERS **/
    getGameFilter(): Observable<any> {
    	return this.gameFilter.asObservable();
    }

    setGameFilter(filterBy: string) {
       this.gameFilterValue = filterBy;
       this.gameFilter.next(filterBy);
    }

    getGameFilterValue(){
        return this.gameFilterValue;
    }



    /** GAME CAMPAIGN FILTERS **/
    getGameCampaignFilter(): Observable<any> {
        return this.gameCampaignFilter.asObservable();
    }

    setGameCampaignFilter(filterBy: string) {
       this.gameCampaignFilterValue = filterBy;
       this.gameCampaignFilter.next(filterBy);
    }

    getGameCampaignFilterValue(){
        return this.gameCampaignFilterValue;
    }


}
