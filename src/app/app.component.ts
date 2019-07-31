import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingProvider } from './../providers/setting/setting';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  selectedTheme: String;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private settings: SettingProvider,public storage: Storage) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {
      this.storage.get('logged_id').then(logged_id => {
        if (logged_id) {
          this.rootPage = HomePage;
        }
        else {
          this.rootPage = LoginPage;
        }
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}