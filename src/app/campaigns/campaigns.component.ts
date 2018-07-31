import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { GameAdAssetService } from '../services/game-ad-asset.service';
import { EventService } from '../services/eventEmitter.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  gameAdAssets: any;
  state: String;
  notifications: any;
  closeResult: string;
  selectedCampaignId: string;

  constructor(
    private authService: AuthService,
    private toaster: ToastrService,
    private _messageService: EventService,
    private gameAdAssetService: GameAdAssetService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.loadGameCampaigns();
  }


  loadGameCampaigns(){
    this.gameAdAssetService.getGameAdCampaigns().subscribe((data) => {
          this.gameAdAssets = data['campaigns'];

          for(var key in data['campaigns']){
            this.gameAdAssets[key].startDate = moment(this.gameAdAssets[key].startDate).format('llll');
            this.gameAdAssets[key].endDate = moment(this.gameAdAssets[key].endDate).format('llll');
          }

      }, errObj => {
        this.toaster.error('Error', errObj.error.err, {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }


  open(content,gameAdAssetId) {

    this.selectedCampaignId = gameAdAssetId;

    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'delete') {
        this.gameAdAssetService.deleteCampaign(gameAdAssetId).subscribe((data) => {

          this.toaster.success('Campaign Deleted', "That campaign has been deleted forever", {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });

          this.loadGameCampaigns();

          }, errObj => {
          this.toaster.error('Error', errObj.error.err, {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
      };

      this.selectedCampaignId = '0';

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
