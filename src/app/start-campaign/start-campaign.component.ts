import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { GameAdAssetService } from '../services/game-ad-asset.service';
import { FileUploader, FileSelectDirective, FileLikeObject } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '../../environments/environment';
import { NgTempusdominusBootstrapModule } from 'ngx-tempusdominus-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


@Component({
  selector: 'app-start-campaign',
  templateUrl: './start-campaign.component.html',
  styleUrls: ['./start-campaign.component.css']
})
export class StartCampaignComponent implements OnInit, OnDestroy {
  gameId: number;
  gameAssets: any;
  newCampaign: boolean;
  selectedGameAssetDescription: any;
  selectedGameAssetTitle: string;
  selectedGameAssetScreenshot: string;
  selectedGameAssetWidth: string;
  selectedGameAssetHeight: string;
  selectedGameAssetSample: string;
  selectedGameAssetType: string;
  selectedGameAvgExposure: number;
  selectedGameAvgSession: number;
  selectedGameExposurePercent: number;
  game: any;
  gameAdAsset: any;
  user: any;
  token: any;
  campaignForm: FormGroup;

  /** Form Model Values */
  width: any;
  height: any;
  resourceUrlHd: string;
  resourceUrlSd: string;
  resourceUrlImg: string;
  maxBid: any;
  dailyBudget: any;
  startDate: any;
  endDate: any;
  API_HOST: string;
  fileUploadKey: string;

  updateGameAdAsset: boolean = false;
  error: any;
  resourceVideoHdErr: boolean = false;
  resourceVideoSdErr: boolean = false;
  resourceImgErr: boolean = false;
  startDatePickerOptions: any = {inline: true, sideBySide: true, format: "dd/MM/YYYY HH:mm:ss"};
  endDatePickerOptions: any = {inline: true, sideBySide: true, format: "dd/MM/YYYY HH:mm:ss"};
  fileUploadUrl: string = environment.API_HOST + '/web/advertiser/upload/asset';
  public resourceVideoHdName: string = "";
  public videoUploader: FileUploader;
  public imageUploader: FileUploader;
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  private sub: any;



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

    this.titleService.setTitle('Start New Campaign');
    this.game = {title:''};

    this.sub = this.route.params.subscribe(params => {

      // Set the game ID to int
      this.gameId = +params['gameId'];

      // This is editing a game ad asset
      if(typeof params['gameAdAssetId'] !== 'undefined'){
        this.titleService.setTitle('Update Campaign');
        this.loadGameData(this.gameId,params['gameAdAssetId']);
      }

      // Creating a new campaign
      else{
        // Load data on the particular game
        this.loadGameData(this.gameId,false);
      }
    });

    // Set default selected game asset details to display to user
    this.selectedGameAssetTitle = "Pending selection";
    this.selectedGameAssetDescription = "Please choose a game asset from the left option to select placement of your advert.";
    this.selectedGameAssetScreenshot = environment.API_HOST + "/adverts/game-assets/screenshots/blank.png";
    this.selectedGameAvgExposure = 0;
    this.selectedGameAvgSession = 0;
    this.selectedGameExposurePercent = 0;

    // Initialise form File Uploads
    this.initFileUploads();
  }


  ngOnDestroy(){
    this.sub.unsubscribe();
  }


    /**
  * Get latest data for the selected game from the server
  */
  loadGameData(gameId,gameAdAssetId){
    this.gameService.getGame(gameId)
      .subscribe((data) => {
          this.game = data;
      }, errObj => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });

    this.gameService.getGameAssets(gameId)
      .subscribe((data) => {
          this.gameAssets = data;

          // Now load the game ad asset to be updated
          if(gameAdAssetId){
            this.loadGameAdAsset(gameAdAssetId);
          }

      }, errObj => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }


  /**
  * Get latest data for the selected game from the server
  */
  loadGameAdAsset(gameAdAssetId){
    this.gameAdAssetService.getGameAdAsset(gameAdAssetId)
      .subscribe((data) => {
          this.gameAdAsset = data;
          this.updateGameAdAsset = true;
          this.updateForm();
      }, errObj => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }



  createForm() {
    this.campaignForm = this.fb.group({
      gameAsset: ['', Validators.required],
      resourceVideoHd: [''],
      resourceVideoSd: [''],
      resourceImgFile: [''],
      width: [''],
      height: [''],
      maxBid: ['', Validators.required],
      dailyBudget: ['', Validators.required],
      resourceUrlHd: [''],
      resourceUrlSd: [''],
      resourceUrlImg: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    },{validator: this.validateAssetUploaded('resourceUrlHd', 'resourceUrlSd','resourceUrlImg')});
  }


  /**
  * Convert the form into an update form
  * and set the values of inputs to the loaded game ad asset (campaign)
  */
  updateForm(){
    if(!this.campaignForm.get('gameAdAssetId')){

      // Select the game asset this game ad asset is linked to
      this.selectGameAsset(this.gameAdAsset.gameAsset.id);

      // Add the game ad asset ID to the form so we know what to update
      this.campaignForm.addControl('gameAdAssetId',new FormControl(['',Validators.required]));

      // Set Default Values from loaded game ad asset
      this.campaignForm.controls['resourceUrlHd'].setValue(this.gameAdAsset.resourceUrlHd);
      this.campaignForm.controls['resourceUrlSd'].setValue(this.gameAdAsset.resourceUrlSd);
      this.campaignForm.controls['resourceUrlImg'].setValue(this.gameAdAsset.resourceUrlImg);
      this.campaignForm.value.gameAdAssetId = this.gameAdAsset.id;
      this.width = this.gameAdAsset.width;
      this.height = this.gameAdAsset.height;
      this.maxBid = this.gameAdAsset.maxBid;
      this.dailyBudget = this.gameAdAsset.dailyBudget;
      this.resourceUrlHd = this.gameAdAsset.resourceUrlHd;
      this.resourceUrlSd = this.gameAdAsset.resourceUrlSd;
      this.resourceUrlImg = this.gameAdAsset.resourceUrlImg;
      this.startDatePickerOptions.date = this.gameAdAsset.startDate;
      this.endDatePickerOptions.date = this.gameAdAsset.endDate;
      this.startDate = this.gameAdAsset.startDate;
      this.endDate = this.gameAdAsset.endDate;
    }
  }


  /**
  * Initialise all the required file uploader components
  * We need two file uploaders, one to configure for videos
  * and another to configure for images
  */
  initFileUploads(){
    let allowedVideoMimeTypes = ['video/mp4', 'video/quicktime', 'application/x-troff-msvideo', 'video/avi', 'video/msvideo', 'video/x-msvideo', 'video/mpeg'];
    let allowedImageMimeTypes = ['image/png','images/jpg', 'image/jpeg', 'image/gif'];

    // Initialise FileUploader for Video File inputs
    this.videoUploader = new FileUploader({allowedMimeType: allowedVideoMimeTypes, url: this.fileUploadUrl + '/video', 
      authToken: "Bearer " + this.token, removeAfterUpload: true, itemAlias: 'asset'});
    this.videoUploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.videoUploader.onErrorItem = (item, response, status, headers) => this.handleFileUploadError(item, response, status, headers);
    this.videoUploader.onWhenAddingFileFailed = (item, filter, options) => this.handleAddingFileFailed(item, filter, options);
    this.videoUploader.onCompleteItem = (item, response, status, headers) => this.handleCompletedFileUpload(item, response, status, headers);

    // Initialise FileUploader for Image File inputs
    this.imageUploader = new FileUploader({allowedMimeType: allowedImageMimeTypes,url: this.fileUploadUrl + '/image', 
      authToken: "Bearer " + this.token, removeAfterUpload: true, itemAlias: 'asset'});
    this.imageUploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.imageUploader.onErrorItem = (item, response, status, headers) => this.handleFileUploadError(item, response, status, headers);
    this.imageUploader.onWhenAddingFileFailed = (item, filter, options) => this.handleAddingFileFailed(item, filter, options);
    this.imageUploader.onCompleteItem = (item, response, status, headers) => this.handleCompletedFileUpload(item, response, status, headers);
  }


  /**
  * Handle adding file to FileUploader Errors
  */
  handleAddingFileFailed(item, filter, options){
    if(filter.name == 'mimeType'){
      this.toaster.error('File Upload Error', "Please check the file type you added is correct", {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
    }else{
      this.toaster.error('File Upload Error', "Please check the type of file you uploaded is acceptable", {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
    }
  }


  /**
  * Handle any FileUploader Errors
  */
  handleFileUploadError(item:any, response:any, status:any, headers:any){
    this.toaster.error('File Upload Error', "Your game advertisement asset was not uploaded", {
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
      response = JSON.parse(response);

      // Server did not upload the file
      if(status != 200){
        this.toaster.error('File Upload Error', "Your game advertisement asset was not uploaded", {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      }
      // Server saved the file on disk and returns a fileName to be used
      else{
        this.toaster.success('File Uploaded', "Your game advertisement asset was uploaded successfully", {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });

        // Input file item uploaded was item.options.additionalParameter.fileInputName
        this.campaignForm.controls[item.options.additionalParameter.inputValueTarget].setValue(response.fileName);
        this[item.options.additionalParameter.inputValueTarget] = response.fileName;
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

      if(this.selectedGameAssetType == 'screen'){
        if(this.resourceUrlHd || this.resourceUrlSd){
          return {};
        }
      }else if(this.selectedGameAssetType == 'texture'){
        if(this.resourceUrlImg){
          return {};
        }
      }

      if(videoHd.value && videoSd.value  && img.value){
        if (videoHd.value.length == 0 && videoSd.value.length == 0 && img.value.length == 0) {
          return {
            missingAsset: true
          };
        }
      }

    }
  }



  createCampaign() {

    this.campaignForm.value.gameId = this.gameId;
    this.campaignForm.value.active = true;

    this.gameAdAssetService.createCampaign(this.campaignForm.value)
      .subscribe((data) => {
        this.toaster.success("Your new advertisement campaign was created successfully. You will need to await for the game owner to approve your advert before it goes live.", 'New Campaign Created', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/campaigns']);
      },
      (errObj) => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }


  updateCampaign() {

    this.campaignForm.value.gameId = this.gameId;
    this.campaignForm.value.active = true;

    console.log("this campaign form values: ",this.campaignForm.value);

    this.gameAdAssetService.updateCampaign(this.gameAdAsset.id,this.campaignForm.value)
      .subscribe((data) => {
        this.toaster.success("Your advertisement campaign was updated successfully. You will need to await for the game owner to approve your advert before it goes live.", 'Campaign Updated', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/campaigns']);
      },
      (errObj) => {
        this.toaster.error(errObj.error.err, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      });
  }



  selectGameAsset(gameAssetId){
    var selectedGameAsset = this.gameAssets.filter(value => value.id === parseInt(gameAssetId));
    this.campaignForm.controls['gameAsset'].setValue(gameAssetId);

    this.selectedGameAssetTitle = selectedGameAsset[0].title;
    this.selectedGameAssetDescription = selectedGameAsset[0].description;
    this.selectedGameAssetHeight = selectedGameAsset[0].height;
    this.selectedGameAssetWidth = selectedGameAsset[0].width;
    this.selectedGameAssetSample = environment.API_HOST + "/web/advertiser/download?item=" + encodeURI(selectedGameAsset[0].sample);
    this.selectedGameAssetType = selectedGameAsset[0].type;
    this.selectedGameAvgExposure = selectedGameAsset[0].avgExposure;
    this.selectedGameAvgSession = selectedGameAsset[0].avgSession;
    this.selectedGameExposurePercent = (this.selectedGameAvgExposure / this.selectedGameAvgSession) * 100;

    this.width = this.selectedGameAssetWidth;
    this.height = this.selectedGameAssetHeight;

    if(selectedGameAsset[0].screenshot != null && selectedGameAsset[0].screenshot != "null"){
      this.selectedGameAssetScreenshot = environment.API_HOST + selectedGameAsset[0].screenshot;
    }
  }



  removeSavedFile(content,savedFileKey){

    this.fileUploadKey = savedFileKey;

      this.modalService.open(content).result.then((result) => {

        if (result === 'delete') {
          this.gameAdAssetService.deleteFile(this.gameAdAsset.id,this.fileUploadKey).subscribe((data) => {

            this.toaster.success("That file has been removed", 'File Deleted', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });

            // Clear this file upload ngmodel value so it doesn't get saved
            this.campaignForm.controls[this.fileUploadKey].setValue("");
            this[this.fileUploadKey] = "";

            }, errObj => {
            this.toaster.error(errObj.error.err, 'Error', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          });
        }
      });
    }

}
