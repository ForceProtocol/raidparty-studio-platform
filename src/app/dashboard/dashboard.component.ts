import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/eventEmitter.service';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  games: any;
  API_HOST: string = environment.API_HOST;

  constructor(
    private authService: AuthService,
    private toaster: ToastrService,
    private _messageService: EventService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.userService.getGames()
      .subscribe((data) => {
          this.games = data['games'];
          
          for(var key in data['games']){
            this.games[key].avatar = this.API_HOST + this.games[key].avatar;
          }

      }, errObj => {
        this.toaster.error(errObj.error.err,'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
    });
  }


}
