import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { EventService } from '../services/eventEmitter.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})

export class SideNavbarComponent implements OnInit {
  gameFilter: string;
  activeRoute: string;

  constructor(
    private messageService: EventService,
    private location: Location) 
  {
  }

  ngOnInit() {
      this.gameFilter = 'active';
      this.messageService.setGameFilter(this.gameFilter);
  }

  setGameFilter(value): void {
    this.gameFilter = value;
    this.messageService.setGameFilter(value);
  }

  isActive(state) {
    return state === this.location.path().split('/')[1];
  }

}
