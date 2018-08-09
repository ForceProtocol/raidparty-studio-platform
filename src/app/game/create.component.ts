import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { GameAdAssetService } from '../services/game-ad-asset.service';
import { FileUploader, FileSelectDirective, FileLikeObject } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '../../environments/environment';
import { NgTempusdominusBootstrapModule } from 'ngx-tempusdominus-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ValidateUrl } from '../validators/url.validator';
import * as moment from 'moment';


@Component({
  selector: 'app-create-game',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateGameComponent implements OnInit, OnDestroy  {

  user: any;
  token: any;
  API_HOST: string;
  game: any;
  createGameForm: FormGroup;
  updatingGame: boolean = false;
  displayAvatar: boolean = false;
  gameId: any;
  previewUrl: any;
  fileUploadKey: string;
  isLoadingImg: boolean = false;
  sub: any;
  savingForm: boolean = false;

  // Form Default Input Names
  avatarFile: any;
  pcPlatform: any;
  macPlatform: any;
  consolePlatform: any;
  androidPlatform: any;
  iosPlatform:any;
  pcChecked: boolean;
  macChecked: boolean;
  consoleChecked: boolean;
  androidChecked: boolean;
  iosChecked: boolean;
  pcLink: string;
  macLink: string;
  consoleLink: string;
  androidLink: string;
  iosLink: string;


  fileUploadUrl: string = environment.API_HOST + '/studio/game/upload/image';
  public resourceVideoHdName: string = "";
  public imageUploader: FileUploader;
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  constructor(
    private fb: FormBuilder,
    private gameAdAssetService: GameAdAssetService,
    private toaster: ToastrService,
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private auth: AuthService,
    private modalService: NgbModal,
    private userService: UserService,
  ) {
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);
      this.token = localStorage.getItem('token');
    }

    this.API_HOST = environment.API_HOST;

    this.createForm();
  }


  ngOnInit() {

    this.titleService.setTitle('Upload New Game');
    this.game = {title:''};

    // Initialise form File Uploads
    this.initFileUploads();


    // If this is a game being editied, we will get a game ID parameter
    this.sub = this.route.params.subscribe(params => {
      // This is editing a game ad asset
      if(typeof params['gameId'] !== 'undefined'){
        this.titleService.setTitle('Update Game');
        this.loadGameData(params['gameId']);
      }
    });

  }


  ngOnDestroy(){
    this.savingForm = false;
    this.sub.unsubscribe();
  }



  /**
  * Lets check if the user has partially filled out the form
  * If they have, check they want to navigate away and loose their data
  */
  @HostListener('window:beforeunload')
  canDeactivate(): boolean {

    if (this.createGameForm.dirty) {
      return window.confirm('You have unsaved game information. Are you sure you wish to navigate away?');
    }

    return true;
  }



  /**
  * Get latest data for the selected game from the server
  */
  loadGameData(gameId){
    this.userService.getGame(gameId)
      .subscribe((data) => {
          this.updatingGame = true;
          this.game = data;

          this.pcPlatform = this.game.gamePlatforms.find(x => x.type == "pc");
          this.macPlatform = this.game.gamePlatforms.find(x => x.type == "mac");
          this.consolePlatform = this.game.gamePlatforms.find(x => x.type == "console");
          this.androidPlatform = this.game.gamePlatforms.find(x => x.type == "android");
          this.iosPlatform = this.game.gamePlatforms.find(x => x.type == "ios");


          if(this.pcPlatform){
            this.pcChecked = true;
            this.pcLink = this.pcPlatform.link;
          }
          if(this.macPlatform){
            this.macChecked = true;
            this.macLink = this.macPlatform.link;
          }
          if(this.consolePlatform){
            this.consoleChecked = true;
            this.consoleLink = this.consolePlatform.link;
          }
          if(this.androidPlatform){
            this.androidChecked = true;
            this.androidLink = this.androidPlatform.link;
          }
          if(this.iosPlatform){
            this.iosChecked = true;
            this.iosLink = this.iosPlatform.link;
          }

          this.updateForm();

      }, errObj => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }



  createForm() {
    this.createGameForm = this.fb.group({
      title: ['',Validators.required],
      description: ['',Validators.required],
      avatar: ['',Validators.required],
      regions: ['',Validators.required],
      mau: ['', Validators.required],
      age: [''],
      male: [''],
      female: [''],
      avatarFile: [''],
      pc: [''],
      mac: [''],
      android: [''],
      ios: [''],
      console: [''],
      pcLink: ['',ValidateUrl],
      macLink: ['', ValidateUrl],
      consoleLink: ['',ValidateUrl],
      androidLink: ['',ValidateUrl],
      iosLink: ['',ValidateUrl]
    });
  }



  /**
  * Convert the form into an update form
  * and set the values of inputs to the loaded game ad asset (campaign)
  */
  updateForm(){
    // Add the game ad asset ID to the form so we know what to update
    this.createGameForm.addControl('gameId',new FormControl(['',Validators.required]));
    this.createGameForm.controls['gameId'].setValue(this.game.id);

    // Set Default Values from loaded game ad asset
    this.createGameForm.controls['avatar'].setValue(this.game.avatar);
    this.previewUrl = this.API_HOST + "/images/games/banners/" + this.game.avatar;
    this.displayAvatar = true;
  }


  /**
  * Initialise all the required file uploader components
  * We need two file uploaders, one to configure for videos
  * and another to configure for images
  */
  initFileUploads(){
    let allowedImageMimeTypes = ['image/png','images/jpg', 'image/jpeg', 'image/gif'];

    // Initialise FileUploader for Image File inputs
    this.imageUploader = new FileUploader({allowedMimeType: allowedImageMimeTypes,url: this.fileUploadUrl, 
      authToken: "Bearer " + this.token, removeAfterUpload: true, itemAlias: 'asset'});
    this.imageUploader.onAfterAddingFile = (file) => { file.withCredentials = false; this.isLoadingImg = false; };
    this.imageUploader.onErrorItem = (item, response, status, headers) => this.handleFileUploadError(item, response, status, headers);
    this.imageUploader.onWhenAddingFileFailed = (item, filter, options) => this.handleAddingFileFailed(item, filter, options);
    this.imageUploader.onCompleteItem = (item, response, status, headers) => this.handleCompletedFileUpload(item, response, status, headers);
  }


  /**
  * Handle adding file to FileUploader Errors
  */
  handleAddingFileFailed(item, filter, options){
    if(filter.name == 'mimeType'){
      this.toaster.error("Please check the file type you added is correct", 'File Upload Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
    }else{
      this.toaster.error("Please check the type of file you uploaded is acceptable", 'File Upload Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
    }
  }


  /**
  * Handle any FileUploader Errors
  */
  handleFileUploadError(item:any, response:any, status:any, headers:any){
    this.toaster.error("Your game screenshot was not uploaded", 'File Upload Error', {
      timeOut: 3000,
      positionClass: 'toast-top-center'
    });
  }


  /**
  * Once a file has finished uploading
  * - get the server response
  * - check file uploaded OK
  * - if success, set the file upload input field to where the file is stored
  */
  handleCompletedFileUpload(item:any, response:any, status:any, headers:any){

      try{
        response = JSON.parse(response);
        this.isLoadingImg = true;
      }catch(err){
        return false;
      }

      // Server did not upload the file
      if(status != 200){
        this.toaster.error("Your game screenshot was not uploaded",'File Upload Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      }
      // Server saved the file on disk and returns a fileName to be used
      else{
        this.toaster.success("Your game screenshot was uploaded successfully",'File Uploaded', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });

        setTimeout(()=>{ 
          //this.setPreviewImage(this.API_HOST + '/images/games/banners/' + this.createGameForm.value.avatar);
          this.displayAvatar = true;
        }, 2000)

        // Input file item uploaded was item.options.additionalParameter.fileInputName
        this.createGameForm.controls[item.options.additionalParameter.inputValueTarget].setValue(response.fileName);
      }
  }


  /**
  * Add additional parameters to a FileUploader object
  * before a file upload occurs
  */
  setFileUploadAdditionalParameters(uploaderObject, fileInputName){
    uploaderObject.setOptions({additionalParameter: { inputValueTarget: fileInputName }});
  }



  /**
  * Ensure that at least one asset (video or image) was uploaded in the form
  */
  validateAssetUploaded(videoHdKey: string, videoSdKey: string, imgKey: string){
    return (group: FormGroup): {[key: string]: any} => {
      let videoHd = group.controls[videoHdKey],
      videoSd = group.controls[videoSdKey],
      img = group.controls[imgKey];

      if(videoHd.value && videoSd.value  && img.value){
        if (videoHd.value.length == 0 && videoSd.value.length == 0 && img.value.length == 0) {
          return {
            missingAsset: true
          };
        }
      }

    }
  }



  createGame() {

    this.savingForm = true;
    this.createGameForm.markAsPristine();

    this.gameService.addGame(this.createGameForm.value)
      .subscribe((data) => {
        this.toaster.success("Your new game was created successfully. Our team will now review the game and reach out to secure brand placement.", 'New Game Received', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        this.savingForm = false;
        this.router.navigate(['/dashboard']);
      },
      (errObj) => {
        this.savingForm = false;
        this.createGameForm.markAsDirty();
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }


  updateGame() {

    this.savingForm = true;
    this.createGameForm.markAsPristine();

    this.gameService.updateGame(this.createGameForm.value,this.game.id)
      .subscribe((data) => {
        this.toaster.success("Your new game was updated successfully.", 'Game Updated', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });

        this.savingForm = false;
        this.router.navigate(['/dashboard']);
      },
      (errObj) => {
        this.savingForm = false;
        this.createGameForm.markAsDirty();
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }



    setPreviewImage(event:any) {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
          this.previewUrl = (<FileReader>event.target).result;
        }

        reader.readAsDataURL(event.target.files[0]);
      }
    }


    // Platform type checkbox changed
    // Remove the link if it is unchecked to clear validation
    // on platform type link
    platformChecked(isChecked,linkKey){
      if(!isChecked){
        this.createGameForm.controls[linkKey].setValue("");
      }
    }

}
