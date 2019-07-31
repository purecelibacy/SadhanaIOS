import { Component } from '@angular/core';
import { NavController, Platform, AlertController, IonicPage } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';
import { ToastController } from 'ionic-angular';

@IonicPage({
  name: 'NotiPage'
})

@Component({
  selector: 'page-noti',
  templateUrl: 'noti.html',
})
export class NotiPage {

  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;
  daily: any;

  constructor(public navCtrl: NavController, public platform: Platform, public alertCtrl: AlertController, public localNotifications: LocalNotifications, private toastCtrl: ToastController) {
    this.notifyTime = moment(new Date()).format();
    this.chosenHours = new Date().getHours();
    this.chosenMinutes = new Date().getMinutes();
    this.daily = { dayCode: 7, checked: false }
    this.days = [
      { title: 'Monday', dayCode: 1, checked: false },
      { title: 'Tuesday', dayCode: 2, checked: false },
      { title: 'Wednesday', dayCode: 3, checked: false },
      { title: 'Thursday', dayCode: 4, checked: false },
      { title: 'Friday', dayCode: 5, checked: false },
      { title: 'Saturday', dayCode: 6, checked: false },
      { title: 'Sunday', dayCode: 0, checked: false }
    ];
  }

  timeChange(time) {
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

  addNotifications() {
    let currentDate = new Date();
    let currentDay = currentDate.getDay();
    if (this.daily.checked == true) {
      for (let i=0;i<7;i++) {
        this.days[i].checked = true; 
      }
    }
    for (let day of this.days) {
      if (day.checked && day.dayCode < 7) {
        let firstNotificationTime = new Date();
        let dayDifference = day.dayCode - currentDay;
        if (dayDifference < 0) {
              dayDifference = dayDifference + 7;
        }
        firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
        firstNotificationTime.setHours(this.chosenHours);
        firstNotificationTime.setMinutes(this.chosenMinutes);
        firstNotificationTime.setSeconds(0);
        let notification = {
          id: day.dayCode,
          title: 'Jay Satchitanand !',
          text: 'Sadhana karvani che :-)',
          at: firstNotificationTime,
          every: 'week'
        };
        this.notifications.push(notification);

      }
    }
    if (this.platform.is('cordova')) {
      this.localNotifications.cancelAll().then(() => {
        this.localNotifications.schedule(this.notifications);
        this.notifications = [];
        let toast = this.toastCtrl.create({
          message: 'Notification set successfully!!!',
          duration: 5000,
          position: 'top'
        });
        toast.present();
      }).catch(res => {
        alert("Unable to Set !!!");
      });
    }
  }
}