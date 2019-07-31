import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import { ActivityData, AllClassDataProvider } from "../../providers/all-class-data/all-class-data";

@Injectable()
export class SqliteLocalProvider {

  public database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(
    public httpClient: HttpClient,
    public alertCtrl: AlertController,
    private sqlite: SQLite,
    public platform: Platform,
    public storage: Storage,
    public http: Http,
    public sqlitePorter: SQLitePorter,
    private dateManipulatorProvider: AllClassDataProvider
  ) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'sadhana.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }
  fillDatabase() {
    this.http.get('assets/dummyDump.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            let today = new Date();
            for (var i = 0; i < 60; i++) {
              let dateid = this.dateManipulatorProvider.generateIdFromDate(today);
              this.insertTodayActivity(dateid);
              today.setDate(today.getDate() - 1);
            }
            this.storage.set('database_filled', true);
          })
      });
  }

  addUser(fname, lname, center, icard) {
    let data = [fname, lname, center, icard]
    return this.database.executeSql("INSERT INTO user (fname, lname, center, icard) VALUES (?, ?, ?, ?)", data).then(res => {
      return res;
    }, err => {
      return err;
    });
  }

  updateUser(fname, lname, center, icard) {
    let deleteQuery = "DELETE FROM user"
    this.database.executeSql(deleteQuery, [])
    this.addUser(fname, lname, center, icard);
  }

  insertTodayActivity(date) {
    let activitydata = [date, "false", "0", "false", "false", "0"]
    return this.database.executeSql("INSERT INTO ActivityData(id, Vidhi, Vanchan, GenSatsang, Samayik, Seva) VALUES (?, ?, ?, ?, ?, ?)", activitydata).then((data) => {
      return data;
    }, err => {
      return err;
    });
  }

  getallUser() {
    return this.database.executeSql("SELECT * FROM user", []).then((data) => {
      let users = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          users.push({ fname: data.rows.item(i).fname, lname: data.rows.item(i).lname, center: data.rows.item(i).center, icard: data.rows.item(i).icard });
        }
      }
      return users;
    }, err => {
      return err;
    });
  }

  getAllActivities() {
    let sd = new Date();
    let ed = new Date();
    ed.setDate(ed.getDate() - 60);
    let _sd = this.dateManipulatorProvider.generateIdFromDate(sd);
    let _ed = this.dateManipulatorProvider.generateIdFromDate(ed);
    return this.database.executeSql("SELECT * FROM ActivityData WHERE id >= ? AND id <= ?", [_ed, _sd]).then((data) => {
      let activity = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let sr = data.rows.item(i);
          let date = this.dateManipulatorProvider.idToDate(parseInt(sr.id));
          let ad = new ActivityData(sr.Vanchan, sr.Samayik === "true" ? true : false, sr.Vidhi === "true" ? true : false, sr.Seva, sr.GenSatsang === "true" ? true : false, date, sr.id);
          activity.push(ad);
        }
      }
      return activity;
    }, err => {
      return err;
    });
  }

  updateActivity(activityData: ActivityData) {
    let dateid = this.dateManipulatorProvider.generateIdFromDate(activityData.date)
    let activitydata = [String(activityData.vidhi), String(activityData.vanchan), String(activityData.generalSatsang), String(activityData.samayik), String(activityData.seva), dateid];
    let updateQuery = "UPDATE ActivityData SET Vidhi= ?, Vanchan= ?, GenSatsang= ?, Samayik= ?, Seva = ? WHERE id = ?"
    this.database.executeSql(updateQuery, activitydata)
  }
  

  getReportData(month: number, year: number) {
    let sd = new Date(year, month, 1, 0, 0, 0, 0);
    let ed = new Date(year, month, 1, 0, 0, 0, 0);
    ed.setMonth(ed.getMonth() + 1);
    let _sd = this.dateManipulatorProvider.generateIdFromDate(sd);
    let _ed = this.dateManipulatorProvider.generateIdFromDate(ed);
    return this.database.executeSql("SELECT * FROM ActivityData WHERE id >= ? AND id < ?", [_sd, _ed]).then((data) => {
      let activity = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let sr = data.rows.item(i);
          let date = this.dateManipulatorProvider.idToDate(parseInt(sr.id));
          let ad = new ActivityData(sr.Vanchan, sr.Samayik, sr.Vidhi, sr.Seva, sr.GenSatsang, date, sr.id);
          activity.push(ad);
        }
      }
      return activity;
    }, err => {
      return err;
    });
  }

  initdatabase() {
    this.sqlite.create({
      name: 'sadhana.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
      })
      .catch(e => alert(e));
  }

}
