import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from "@angular/platform-browser";
import { AuthService } from './services/auth.service';
import { HelperService } from './services/helper.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showDiv: boolean = false;
  playerCode: string;
  constructor(private auth: AuthService,
              private router: Router,
              private title: Title,
              public helperService: HelperService,
              private location: Location
        ) {

    this.router.events.subscribe((event)=>{

      let urlParts = router.url.split("/");

      // Set the web browser page title
      this.title.setTitle(this.helperService.capitalize(urlParts[urlParts.length - 1]));

      if (urlParts[urlParts.length - 1] == "list") {
        this.showDiv = false;
      } else {
        this.showDiv = true;
      }

    });
  }

  ngOnInit() { }

  isLoggedIn() {
    return this.auth.isLoggedIn;
  }


  isActive(state) {
    let cleanUrl = this.router.url.split('?')[0];
    cleanUrl = cleanUrl.split('#')[0];
    return state === cleanUrl.split('/')[1];
  }
}
