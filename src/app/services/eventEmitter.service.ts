import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventService {
    private _listners = new Subject<any>();
    private campaignFilter = new Subject<any>();
    private campaignFilterValue: string;

    listen(): Observable<any> {
       return this._listners.asObservable();
    }

    getCampaignFilter(): Observable<any> {
    	return this.campaignFilter.asObservable();
    }

    setCampaignFilter(filterBy: string) {
       this.campaignFilterValue = filterBy;
       this.campaignFilter.next(filterBy);
    }

    getCampaignFilterValue(){
        return this.campaignFilterValue;
    }

}
