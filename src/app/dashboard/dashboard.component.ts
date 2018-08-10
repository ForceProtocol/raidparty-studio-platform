import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/eventEmitter.service';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { environment } from '../../environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  games: any;
  API_HOST: string = environment.API_HOST;
  gameFilter: string = 'active';
  isLoading: boolean = true;
  selectedGameId: number;

  state: String;
  notifications: any;
  closeResult: string;
  active: boolean = true;
  archived: boolean = false;

  constructor(
    private authService: AuthService,
    private toaster: ToastrService,
    private eventService: EventService,
    private userService: UserService,
    private gameService: GameService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.eventService.getGameFilter().subscribe((msg: any) => {
      this.gameFilter = msg;
      this.loadGames();
    });
    this.loadGames();
  }


  loadGames(){

    this.isLoading = true;

    if(this.gameFilter == 'active'){
      this.active = true;
      this.archived = false;
    }else if(this.gameFilter == 'archived'){
      this.active = false;
      this.archived = true;
    }

    this.userService.getGames(this.active,this.archived)
      .subscribe((data) => {
          this.isLoading = false;
          
          this.games = data;
          
          for(var key in this.games){
            this.games[key].avatar = this.API_HOST + "/images/games/banners/" + this.games[key].avatar;
          }

      }, errObj => {
        this.toaster.error(errObj.error.err,'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
    });
  }

  pauseAdverts(gameId){
    this.gameService.pauseCampaigns(gameId)
      .subscribe((data) => {
        this.toaster.success("All adverts have been stopped on this game.",'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      }, errObj => {
        this.toaster.error(errObj.error.err,'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
    });

  }



  open(content,gameId,activeState = true) {

    this.selectedGameId = gameId;

    this.modalService.open(content).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

      if (result === 'archive') {
        this.gameService.archiveGame(gameId,true).subscribe((data) => {

          this.toaster.success("That game has been archived", 'Game Archived', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });

          this.loadGames();

          }, errObj => {
          this.toaster.error(errObj.error.err, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
      }

      else if (result === 'removeArchive') {
        this.gameService.archiveGame(gameId,false).subscribe((data) => {

          this.toaster.success("That game has been moved out of the archive and re-enabled", 'Game Re-enabled', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });

          this.loadGames();

          }, errObj => {
          this.toaster.error(errObj.error.err, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
      }

      else if (result === 'delete') {
        this.gameService.deleteGame(gameId).subscribe((data) => {

          this.toaster.success("That game has been permanently deleted", 'Game Deleted', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });

          this.loadGames();

          }, errObj => {
          this.toaster.error(errObj.error.err, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
      }

      else if(result === 'activate') {
        this.gameService.activateGame(gameId, activeState).subscribe((data) => {

          if(!activeState){
            this.toaster.success("That game has been paused", 'Game Paused', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          }else{
            this.toaster.success("That game has been activated", 'Game Activated', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          }

          this.loadGames();

          }, errObj => {
          this.toaster.error(errObj.error.err, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
      }

      this.selectedGameId = 0;
    });

  }


}
