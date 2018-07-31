import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { EventService } from '../services/eventEmitter.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})

export class SideNavbarComponent implements OnInit {
  platFormType: string;
  activeRoute: string;
  constructor(
    private _messageService: EventService,
    private location: Location) 
  {
      this.platFormType = 'android';
  }

  ngOnInit() {
      this.platFormType = 'android';
  }

  clickFilter(value): void {
    this.platFormType = value;
    this._messageService.filter(value);
  }

  isActive(state) {
    return state === this.location.path().split('/')[1];
  }

}
