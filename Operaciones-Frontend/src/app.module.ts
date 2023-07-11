import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { NotificationModule } from './notification.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, NotificationModule],
  providers: [],
  bootstrap: [HomeComponent],
})
export class AppModule {}
