import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { GameAdAssetService } from '../services/game-ad-asset.service';
import { EventService } from '../services/eventEmitter.service';
import * as moment from 'moment';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

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
