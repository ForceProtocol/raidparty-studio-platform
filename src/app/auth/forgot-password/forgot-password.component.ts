import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  changePasswordForm: FormGroup;
  error: string;
  isForgetPassword: boolean;
  userId: string;
  pin: string;
  email: string;


  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private toaster: ToastrService,
              private activatedRoute: ActivatedRoute) {
    const user = localStorage.getItem('user');
    if (user) {
      router.navigate(['/dashboard']);
    }
    
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {

    if (this.activatedRoute.snapshot.queryParams.user && 
        this.activatedRoute.snapshot.queryParams.pin &&
        this.activatedRoute.snapshot.queryParams.email) {

      this.isForgetPassword = false;
      this.userId = this.activatedRoute.snapshot.queryParams.user;
      this.email = this.activatedRoute.snapshot.queryParams.email;
      this.pin = this.activatedRoute.snapshot.queryParams.pin;

      this.changePasswordForm = this.fb.group({
        password: ['', Validators.required],
        passwordCheck: ['', Validators.required],
        pin: [this.pin,Validators.required],
        email: [this.email,Validators.required],
        userId: [this.userId,Validators.required]
      });

    } else {
      this.isForgetPassword = true;
      this.forgotPasswordForm = this.fb.group({
        email: ['', Validators.email]
      });
    }
  }

  resetPassword() {
    this.auth.resetPassword(this.forgotPasswordForm.value)
      .subscribe((data) => {
        this.toaster.success(data['msg'], 'Success', {
          timeOut: 3000,
          positionClass: "toast-top-right"
        });
        this.router.navigate(['/login']);
      },
      (errorObj) => {
        this.toaster.error( errorObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: "toast-top-center"
        })
      });
  }

  changePassword() {
    this.auth.changePassword(this.changePasswordForm.value)
      .subscribe((response) => {
        this.toaster.success(response.msg, 'Success', {
          timeOut: 3000,
          positionClass: "toast-top-right"
        });
        this.router.navigate(['/login']);
      },
      (errorObj) => {
        this.toaster.error(errorObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: "toast-top-center"
        })
      });
  }

}
