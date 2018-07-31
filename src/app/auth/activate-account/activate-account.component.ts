import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  activationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toaster: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.params = this.activatedRoute.snapshot.queryParams;
    this.createForm();
  }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  createForm() {
    this.activationForm = this.fb.group({
      pin: ['', Validators.required]
    });
  }

  activatePlayer() {
    console.log(this.activationForm.value);
    this.auth.activateUser(this.params.userId, this.activationForm.value.pin)
      .subscribe((data) => {
        this.toaster.success('Success', data.msg, {
          timeOut: 3000,
          positionClass: "toast-top-right"
        });
        this.router.navigate(['/login']);
      },
      (errorObj) => {
        this.toaster.error('Error', errorObj.error.err, {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }
}
