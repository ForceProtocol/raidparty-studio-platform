import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventService {
    private _listners = new Subject<any>();
    private gameFilter = new Subject<any>();
    private gameFilterValue: string;

    listen(): Observable<any> {
       return this._listners.asObservable();
    }

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

}
