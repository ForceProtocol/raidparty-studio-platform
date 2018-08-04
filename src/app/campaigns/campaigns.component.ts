import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { GameAdAssetService } from '../services/game-ad-asset.service';
import { EventService } from '../services/eventEmitter.service';
import { HelperService } from '../services/helper.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  active: boolean = true;
  archived: boolean = false;

  constructor(
    private authService: AuthService,
    private toaster: ToastrService,
    private messageService: EventService,
    private gameAdAssetService: GameAdAssetService,
    private modalService: NgbModal,
    private helperService: HelperService,
  ) {
    this.messageService.getCampaignFilter().subscribe((msg: any) => {
      this.campaignFilter = msg;
      this.loadGameCampaigns();
    });
  }

  ngOnInit() {
    this.campaignFilter = this.messageService.getCampaignFilterValue();
    this.loadGameCampaigns();
  }


  loadGameCampaigns(){

    if(this.campaignFilter == 'active'){
      this.active = true;
      this.archived = false;
    }else if(this.campaignFilter == 'archived'){
      this.active = false;
      this.archived = true;
    }


    this.gameAdAssetService.getGameAdCampaigns(this.active,this.archived).subscribe((data) => {

          this.gameAdAssets = data['campaigns'];

          for(var key in data['campaigns']){
            this.gameAdAssets[key].startDate = moment(this.gameAdAssets[key].startDate).format('llll');
            this.gameAdAssets[key].endDate = moment(this.gameAdAssets[key].endDate).format('llll');

            // Format the exposure time in nice format
            if(this.gameAdAssets[key].totalExposure > 1){
              this.gameAdAssets[key].totalExposure = moment.duration(this.gameAdAssets[key].totalExposure * 10, 'seconds').humanize();
            }else{
              this.gameAdAssets[key].totalExposure = '0 seconds';
            }

            this.gameAdAssets[key].status = this.helperService.capitalize(this.gameAdAssets[key].status);
          }

      }, errObj => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }


  open(content,gameAdAssetId,activeState = true) {

    this.selectedCampaignId = gameAdAssetId;

    this.modalService.open(content).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

      if (result === 'archive') {
        this.gameAdAssetService.archiveCampaign(gameAdAssetId,true).subscribe((data) => {

          this.toaster.success("That campaign has been archived", 'Campaign Archived', {
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

      else if (result === 'removeArchive') {
        this.gameAdAssetService.archiveCampaign(gameAdAssetId,false).subscribe((data) => {

          this.toaster.success("That campaign has been moved out of the archive and re-enabled", 'Campaign Re-enabled', {
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

      else if (result === 'delete') {
        this.gameAdAssetService.deleteCampaign(gameAdAssetId).subscribe((data) => {

          this.toaster.success("That campaign has been permanently deleted", 'Campaign Deleted', {
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

      else if(result === 'activate') {
        this.gameAdAssetService.activateCampaign(gameAdAssetId, activeState).subscribe((data) => {

          if(!activeState){
            this.toaster.success("That campaign has been paused", 'Campaign Paused', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          }else{
            this.toaster.success("That campaign has been activated", 'Campaign Activated', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          }

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
