import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { EventService } from '../services/eventEmitter.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})

export class SideNavbarComponent implements OnInit {
  campaignFilter: string;
  activeRoute: string;

  constructor(
    private messageService: EventService,
    private location: Location) 
  {
  }

  ngOnInit() {
      this.campaignFilter = 'active';
      this.messageService.setCampaignFilter(this.campaignFilter);
  }

  setCampaignFilter(value): void {
    this.campaignFilter = value;
    this.messageService.setCampaignFilter(value);
  }

  isActive(state) {
    return state === this.location.path().split('/')[1];
  }

}
