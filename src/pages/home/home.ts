import { Component } from '@angular/core';
import { NavController, PopoverController, AlertController } from 'ionic-angular';
import { PopoverPage } from '../popover/popover';
import { AllClassDataProvider, Months } from '../../providers/all-class-data/all-class-data';
import { SqliteLocalProvider } from '../../providers/sqlite-local/sqlite-local';
import { File } from "@ionic-native/file";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  month: string;
  allData = [];

  public event = {
    month1: '2000-02-19'
  }

  selectedTheme: String;

  constructor(
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    private dateManipulatorProvider: AllClassDataProvider,
    private sqliteLocalProvider: SqliteLocalProvider,
    public alertCtrl: AlertController,
    public file: File,
  ) {
    // let today = new Date();
    // // for (var i = 0; i < 6; i++) {
    //   let dateid = this.dateManipulatorProvider.generateIdFromDate(today);
    //   this.sqliteLocalProvider.insertTodayActivity(dateid);
    //   today.setDate(today.getDate() - 1);
    // // }
    // this.sqliteLocalProvider.getAllActivities().then(activities => {
    //   this.allData = activities;
    //   this.allData.reverse();
    // });
  }

  ngOnInit() {
    this.month = Months[new Date().getMonth()];
  }

  cols=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

  

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev: event });
  }

  ionViewDidEnter() {
    let today = new Date();
    for (var i = 0; i < 6; i++) {
      let dateid = this.dateManipulatorProvider.generateIdFromDate(today);
      this.sqliteLocalProvider.insertTodayActivity(dateid);
      today.setDate(today.getDate() - 1);
    }
    this.sqliteLocalProvider.getAllActivities().then(activities => {
      this.allData = activities;
      this.allData.reverse();
    });
  }

  popUpVanchan(col) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Pages...');
    for (let i = 0; i < 100; i++) {
      alert.addInput({
        type: 'radio',
        label: i.toString(),
        value: i.toString()
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data) {
          col.vanchan = data;
          this.sqliteLocalProvider.updateActivity(col);
        }
      }
    });
    alert.present();
  }

  popUpSeva(col) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Hours...');
    for (let i = 0; i < 25; i++) {
      alert.addInput({
        type: 'radio',
        label: i.toString(),
        value: i.toString()
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data) {
          col.seva = data;
          this.sqliteLocalProvider.updateActivity(col);
        }
      }
    });
    alert.present();
  }

  checked(_index, _task) {
    // setTimeout(()=>{
      this.allData.forEach(element => {
        if (element._id == _index) {
          this.sqliteLocalProvider.updateActivity(element);
        }
      });
    // },10000);
  }

}
