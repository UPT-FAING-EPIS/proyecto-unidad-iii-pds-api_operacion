import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxNotifierModule } from 'ngx-notifier';

@NgModule({
  imports: [BrowserAnimationsModule, NgxNotifierModule],
  exports: [BrowserAnimationsModule, NgxNotifierModule],
})
export class NotificationModule {}
