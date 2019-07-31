import { Injectable } from '@angular/core';

@Injectable()
export class AllClassDataProvider {
  generateIdFromDate(date:Date):number{
    let _id = "";
    if(!date){
      let _date = new Date();
       _id = String(_date.getFullYear()) + (String(_date.getMonth()).length == 1 ? '0'+ String(_date.getMonth()): String(_date.getMonth()))+ (String(_date.getDate()).length == 1 ? '0'+ String(_date.getDate()): String(_date.getDate()))
      return parseInt(_id);
      } else {
      let _date = date;
       _id = String(_date.getFullYear()) + (String(_date.getMonth()).length == 1 ? '0'+ String(_date.getMonth()): String(_date.getMonth()))+ (String(_date.getDate()).length == 1 ? '0'+ String(_date.getDate()): String(_date.getDate()))
      return parseInt(_id);
    }
  }

  idToDate(dateid:number):Date{
    let date:number = dateid % 100;
    dateid = dateid /100;
    let month:number = dateid % 100;
    dateid = dateid /100
    return new Date(dateid,month,date,0,1,0,0);
  }
}

export enum Months{
  "Jan" = 0, 
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
}

export class ActivityData {

  vanchan: Number;
  samayik: boolean;
  vidhi: boolean;
  seva: Number;
  generalSatsang: boolean;
  date: Date;
  day: number;
  month: string;
  dateString: string;
  _id:number;

  constructor(_vanchan: Number, _samayik: boolean, _vidhi: boolean, _seva: Number, _generalSatsang: boolean, _date: Date, __id:number) {
    this._id = __id
    this.date = _date;
    this.day = this.date.getDate();
    this.month = Months[this.date.getMonth()]
    this.vanchan = _vanchan;
    this.samayik = _samayik;
    this.vidhi = _vidhi;
    this.seva = _seva;
    this.generalSatsang = _generalSatsang;
  }
  
}
