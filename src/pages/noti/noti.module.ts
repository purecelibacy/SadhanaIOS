import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotiPage } from './noti';

@NgModule({
  declarations: [
    NotiPage,
  ],
  imports: [
    IonicPageModule.forChild(NotiPage),
  ],
})
export class NotiPageModule {}
