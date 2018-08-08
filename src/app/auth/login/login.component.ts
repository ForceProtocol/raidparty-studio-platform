import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  developerId: string;
  pin: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toaster: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    
    const user = localStorage.getItem('user');
    if (user) {
      router.navigate(['/dashboard']);
    }

    const params = this.activatedRoute.snapshot.queryParams;
    this.createForm();
  }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  createForm() {

    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  login() {
    this.auth.login(this.loginForm.value)
      .subscribe((data) => {
        this.toaster.success("Logged in successfully",'Success',{
          timeOut: 3000,
          positionClass: "toast-top-right"
        });
        this.router.navigate(['/dashboard']);
      },
        (errorObj) => {
          this.toaster.error(errorObj.error.err, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
        });
  }

}
