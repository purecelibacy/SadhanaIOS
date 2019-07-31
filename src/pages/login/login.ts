import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { SqliteLocalProvider } from "../../providers/sqlite-local/sqlite-local";
import { Storage } from '@ionic/storage';
import { WelcomePage } from "../welcome/welcome";
import { HomePage } from '../home/home';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var cordova: any;

@IonicPage({
  name: 'LoginPage'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginValidation: FormGroup;
  user = {};
  fname: any;
  storageDirectory: string = '';
  submitButtonName: string = "Submit"
  loggedin: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private sqlite: SqliteLocalProvider,
    private storage: Storage,
    public platform: Platform,
    public formBuilder: FormBuilder
  ) {
    this.loginValidation = formBuilder.group({
      firstName: ['',Validators.compose([Validators.minLength(1), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['',Validators.compose([Validators.minLength(1), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      center: ['',Validators.compose([Validators.minLength(1), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      icard: ['',Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])]
  });

    this.platform.ready().then(() => {
      if (!this.platform.is('cordova')) {
        return false;
      }
      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if (this.platform.is('android')) {
        this.storageDirectory = cordova.file.externalDataDirectory;
      }
      else {
        return false;
      }
      this.storage.get('logged_id').then(logged_id => {
        if (logged_id) {
          this.loggedin = true;
        }
      });
    });
  }

  ionViewDidLoad() {
    this.storage.get('intro-done').then(done => {
      if (!done) {
        this.storage.set('intro-done', true);
        this.navCtrl.setRoot(WelcomePage);
      }
    });
  }

  ionViewDidEnter() {
    if (this.loggedin == true) {
      this.loadUserData();
      this.submitButtonName = "Update";
    }
  }

  addUser() {
    if (this.loggedin == true) {
      this.sqlite.updateUser(this.user['fname'], this.user['lname'], this.user['center'], parseInt(this.user['icard']));
      this.navCtrl.pop();
    } else {
      this.sqlite.addUser(this.user['fname'], this.user['lname'], this.user['center'], parseInt(this.user['icard']))
        .then(data => {
          this.navCtrl.setRoot(HomePage);
          this.storage.set('logged_id', true);
        });
      this.user = {};
    }
  }

  loadUserData() {
    this.sqlite.getallUser().then(data => {
      this.user = data[0];   
    })
  }

  cancel() {
    this.navCtrl.pop();
  }

}
