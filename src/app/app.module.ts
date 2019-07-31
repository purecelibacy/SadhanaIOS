import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { PopoverPage } from "../pages/popover/popover";
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { NotiPage } from "../pages/noti/noti";
import { WelcomePage } from "../pages/welcome/welcome";
import { SettingProvider } from '../providers/setting/setting';
import { AllClassDataProvider } from '../providers/all-class-data/all-class-data';
import { SqliteLocalProvider } from '../providers/sqlite-local/sqlite-local';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { File } from "@ionic-native/file";
import { SocialSharing } from '@ionic-native/social-sharing';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PopoverPage,
    LoginPage,
    NotiPage,
    WelcomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PopoverPage,
    LoginPage,
    NotiPage,
    WelcomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingProvider,
    AllClassDataProvider,
    SqliteLocalProvider,
    HttpClientModule,
    LocalNotifications,
    SQLite,
    File,
    SQLitePorter,
    SocialSharing
  ]
})
export class AppModule {}
