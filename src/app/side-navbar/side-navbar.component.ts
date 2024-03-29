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
  gameCampaignFilter: string;
  activeRoute: string;

  constructor(
    private messageService: EventService,
    private location: Location) 
  {
  }

  ngOnInit() {
      this.gameFilter = 'active';
      this.gameCampaignFilter = 'approved';
      this.messageService.setGameFilter(this.gameFilter);
  }

  setGameFilter(value): void {
    this.gameFilter = value;
    this.messageService.setGameFilter(value);
  }

  setGameCampaignFilter(value): void {
    this.gameCampaignFilter = value;
    this.messageService.setGameCampaignFilter(value);
  }

  isActive(state) {
    return state === this.location.path().split('/')[1];
  }

}
