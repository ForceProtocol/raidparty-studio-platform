import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { EventService } from '../services/eventEmitter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isCollapsed: boolean = false;
  contactForm: FormGroup;
  formSubmitted: boolean = false;
  captchaResponse: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    private _messageService: EventService,
    private gameService: GameService,
  ) {
    this.createForm();
  }

  ngOnInit() {
  }


  createForm() {
    this.contactForm = this.fb.group({
      email: ['', Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)],
      name: ['', Validators.required],
      telephone: ['', Validators.required],
      message: ['', Validators.required],
      captcha: ['']
    });
  }

  contact() {

    if(!this.captchaResponse){
      this.toaster.error('Error', "You must check the captcha box", {
          timeOut: 3000,
          positionClass: 'toast-center-center'
        });

      return;
    }

    this.formSubmitted = true;
    this.contactForm.value.captcha = this.captchaResponse;

    this.authService.contact(this.contactForm.value)
      .subscribe((data) => {
        this.toaster.success(data['msg'], 'Success', {
          timeOut: 3000,
          positionClass: 'toast-center-center'
        });
      },
      (errorObj) => {
        this.toaster.error('Error', errorObj.error.err, {
          timeOut: 3000,
          positionClass: 'toast-center-center'
        });

        this.formSubmitted = false;
      });
  }


  handleCorrectCaptcha($event){
    this.captchaResponse = $event;
  }


}
