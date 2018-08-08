import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  params: any;

  constructor(
    private auth: AuthService,
    private toaster: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      router.navigate(['/dashboard']);
    }
    
    this.params = this.activatedRoute.snapshot.queryParams;
  }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }

    this.auth.activateUser(this.params.studioId, this.params.pin, this.params.email)
      .subscribe((data) => {
        this.toaster.success( data.msg, 'Success', {
          timeOut: 3000,
          positionClass: "toast-top-right"
        });
        this.router.navigate(['/login']);
      },
      (errorObj) => {
        this.toaster.error(errorObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }

}
