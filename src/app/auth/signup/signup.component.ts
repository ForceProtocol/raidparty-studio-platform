import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  error: any;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private toaster: ToastrService,
    private router: Router) {

    const user = localStorage.getItem('user');
    if (user) {
      router.navigate(['/dashboard']);
    }

    this.createForm();
  }

  ngOnInit() {
  }


  createForm() {
    this.signupForm = this.fb.group({
      companyName: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      telephone: [''],
      email: ['', Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)],
      password: ['', Validators.required],
      passwordCheck: ['', Validators.required],
      acceptTerms: [false, Validators.required],
      captcha: ['',Validators.required]
    },{validator: this.validatePasswords('password','passwordCheck')});
  }


  validatePasswords(passwordKey: string, passwordCheckKey: string){
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey],
        passwordCheck = group.controls[passwordCheckKey];

      if(password.value != passwordCheck.value){
        this.signupForm.controls['passwordCheck'].setErrors({matchPassword: true});
        return;
      }

      return null;
    }
  }


  signup() {
    // In case if user first check and then un-check the terms & condition
    if (this.signupForm.value.acceptTerms === false) {
      this.toaster.error('Please agree to Terms & Conditions', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }

    this.auth.signup(this.signupForm.value)
      .subscribe((data) => {
        this.toaster.success(data['msg'], 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
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


  handleCorrectCaptcha(captcha){
    this.signupForm.controls['captcha'].setValue(captcha);
  }

}
