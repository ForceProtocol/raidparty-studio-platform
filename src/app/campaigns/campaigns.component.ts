import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { GameAdAssetService } from '../services/game-ad-asset.service';
import { EventService } from '../services/eventEmitter.service';
import { HelperService } from '../services/helper.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  gameAdAssets: any = {};
  state: String;
  notifications: any;
  closeResult: string;
  selectedCampaignId: string;
  campaignFilter: string;
  approved: boolean = true;
  pending: boolean = false;
  API_HOST: string = environment.API_HOST;
  token: string;

  constructor(
    private authService: AuthService,
    private toaster: ToastrService,
    private eventService: EventService,
    private gameAdAssetService: GameAdAssetService,
    private modalService: NgbModal,
    private helperService: HelperService,
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    this.campaignFilter = this.eventService.getGameCampaignFilterValue();
    this.eventService.getGameCampaignFilter().subscribe((msg: any) => {
      this.campaignFilter = msg;
      this.loadGameCampaigns();
    });

    this.loadGameCampaigns();
  }


  loadGameCampaigns(){

    if(this.campaignFilter == 'approved'){
      this.approved = true;
    }else if(this.campaignFilter == 'pending'){
      this.approved = false;
    }


    this.gameAdAssetService.getGameAdverts(this.approved).subscribe((data) => {

          this.gameAdAssets = data['campaigns'];

          for(var key in data['campaigns']){
            this.gameAdAssets[key].startDate = moment(this.gameAdAssets[key].startDate).format('llll');
            this.gameAdAssets[key].endDate = moment(this.gameAdAssets[key].endDate).format('llll');

            // Format the exposure time in nice format
            if(this.gameAdAssets[key].totalExposure > 1){
              this.gameAdAssets[key].totalExposure = moment.duration(this.gameAdAssets[key].totalExposure, 'seconds').humanize();
            }else{
              this.gameAdAssets[key].totalExposure = '0 seconds';
            }

            this.gameAdAssets[key].status = this.helperService.capitalize(this.gameAdAssets[key].status);

            if(this.gameAdAssets[key].archived){
              this.gameAdAssets[key].status = "Archived";
            }
          }

      }, errObj => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }


  open(content,gameAdAssetId) {

    this.selectedCampaignId = gameAdAssetId;

    this.modalService.open(content).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

      if (result === 'stop') {
        this.gameAdAssetService.stopAdvert(gameAdAssetId).subscribe((data) => {

          this.toaster.success("That advert has been stopped and will now be placed into pending", 'Advert Stopped', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });

          this.loadGameCampaigns();

          }, errObj => {
          this.toaster.error(errObj.error.err, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
      }

      else if (result === 'approve') {
        this.gameAdAssetService.approveAdvert(gameAdAssetId).subscribe((data) => {

          this.toaster.success("That advert has been approved", 'Advert Approved', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });

          this.loadGameCampaigns();

          }, errObj => {
          this.toaster.error(errObj.error.err, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
      }

      this.selectedCampaignId = '0';
    });

  }


}
