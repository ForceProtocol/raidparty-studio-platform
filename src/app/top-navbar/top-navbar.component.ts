import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  state: String;
  notifications: any;
  closeResult: string;
  currentPassword: string;
  newPassword: string;
  newPasswordRepeat: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private notification: NotificationService,
    private modalService: NgbModal,
    private toaster: ToastrService,
  ) { }

  ngOnInit() {
    this.getNotification();
  }

  isActive(state) {
    let cleanUrl = this.router.url.split('?')[0];
    cleanUrl = cleanUrl.split('#')[0];

    if(state === cleanUrl){
      return true;
    }

    return state === cleanUrl.split('/')[1];
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

	
  getNotification() {
  }

  deleteNotification(notificationObj) {
    const removeIndex = this.notifications.map(function (item) { return item.id; })
      .indexOf(notificationObj.id);
    this.notifications.splice(removeIndex, 1);
    this.notification.deleteNotification(notificationObj.id)
      .subscribe(data => {
        if (data['success']) {
          this.toaster.success('Notification is deleted', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        }
      }, errObj => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'save') {
        this.updatePassword();
      }
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

  private updatePassword() {

    if (!this.currentPassword || !this.newPassword) {
      this.currentPassword = "";
      this.newPassword = "";
      this.newPasswordRepeat = "";

      this.toaster.error('Please provide all inputs','Error',{
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }

    if(this.newPassword != this.newPasswordRepeat){
      
      this.currentPassword = "";
      this.newPassword = "";
      this.newPasswordRepeat = "";

      this.toaster.error('Your new passwords do not match', 'Error',{
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }


    this.auth.updatePassword(this.currentPassword, this.newPassword)
      .subscribe(data => {

        this.currentPassword = "";
        this.newPassword = "";
        this.newPasswordRepeat = "";

        if (data['success']) {
          this.toaster.success(data['msg'], 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        }
      }, errObj => {
        this.toaster.error(errObj.error.err,'Error',{
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }

}
