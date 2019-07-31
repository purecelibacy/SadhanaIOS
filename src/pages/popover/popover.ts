import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, App, Platform } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { SqliteLocalProvider } from '../../providers/sqlite-local/sqlite-local';
import { Months } from "../../providers/all-class-data/all-class-data";
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from "@ionic-native/file";
import { LoginPage } from '../login/login';
import { NotiPage } from '../noti/noti';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  selectedTheme = 'light-theme';
  storageDirectory: string = '';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private settings: SettingProvider,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public app: App,
    public sqliteLocalProvider: SqliteLocalProvider,
    public file: File,
    public platform: Platform,
    private socialSharing: SocialSharing
    ) {
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
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  toggletheme() {
    if (this.selectedTheme == 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
      this.selectedTheme = 'light-theme';
    } 
    else {
      this.settings.setActiveTheme('dark-theme');
      this.selectedTheme = 'dark-theme';
    }
  }

  EditProfile() {
    this.app.getRootNav().push(LoginPage);
    this.viewCtrl.dismiss();
  }

  Notification() {
    this.app.getRootNav().push(NotiPage);
    this.viewCtrl.dismiss();
  }

  ShareReport() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Month');
    let _date = new Date();
    _date.setMonth(_date.getMonth()-1);
    for (let i = 0; i < 12; i++) {
      alert.addInput({
        type: 'radio',
        label: String(Months[_date.getMonth()]) + "," + String(_date.getFullYear()),
        value: String(_date)
      });
      _date.setMonth(_date.getMonth() - 1);
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        _date = new Date(data);
        this.Share(_date.getMonth(), _date.getFullYear());
      }
    });
    alert.present();
    this.viewCtrl.dismiss();
  }

  Share(month, year){
    this.sqliteLocalProvider.getReportData(month, year).then(monthlyActivities => {
      this.sqliteLocalProvider.getallUser().then(user => {
        let text = "Month , " + user[0].center + "," + user[0].fname + " " + user[0].lname + "," + String(user[0].icard) + "\n date,samayik,vanchan,vidhi,G.Satsang,seva\n";
        if (monthlyActivities.length > 0) {
          let total = {
            _samayik: 0,
            _seva: 0,
            _vanchan: 0,
            _gSatsang: 0,
            _vidhi: 0
          };
          monthlyActivities.forEach(element => {
            text += String(element.date.getDate()) + "_" + Months[element.date.getMonth()] + "_" + String(element.date.getFullYear()) + ",";
            if (element.samayik == "true") {
              text += "Y" + ",";
              total._samayik += 1;
            } else {
              text += "N" + ",";
            }
            text += String(element.vanchan) + ",";
            total._vanchan += parseInt(element.vanchan);
            if (element.vidhi == "true") {
              text += "Y" + ",";
              total._vidhi += 1;
            } else {
              text += "N" + ",";
            }
            if (element.generalSatsang == "true") {
              text += "Y" + ",";
              total._gSatsang += 1;
            } else {
              text += "N" + ",";
            }
            text += String(element.seva) + "\n";
            total._seva += parseInt(element.seva);
          });
          text += "Total," + String(total._samayik) + "," + String(total._vanchan) + "," + String(total._vidhi) + "," + String(total._gSatsang) + "," + String(total._seva) + "\n";
          let filename = user[0].fname + "_" + user[0].lname + "_" + String(user[0].icard) + "_" + Months[month] + "_" + String(year) + ".csv";
          this.file.writeFile(this.storageDirectory, filename, text, { replace: true }).then(res => {
            this.socialSharing.share("Monthly Report", "Sadhana-Report of this month" ,res.filesystem.root.nativeURL+filename, null);
          }).catch(res => {
            alert("Unable to generate report please contact Admin");
          });
        } else {
          alert("No Data available for selected Month!!!");
        }
      });
    });
  }

}
