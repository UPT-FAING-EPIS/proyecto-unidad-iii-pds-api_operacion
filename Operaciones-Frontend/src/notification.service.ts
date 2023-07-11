import { Injectable } from '@angular/core';
import { NgxNotifierService } from 'ngx-notifier';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifier: NgxNotifierService;
  private static readonly DURATION: number = 5000;

  constructor(notifierService: NgxNotifierService) {
    this.notifier = notifierService;
  }

  public onInfo(msg: string): void {
    this.notifier.createToast(
      msg,
      NotificationType.INFO,
      NotificationService.DURATION
    );
  }

  public onSuccess(msg: string): void {
    this.notifier.createToast(
      msg,
      NotificationType.SUCCESS,
      NotificationService.DURATION
    );
  }

  public onWarning(msg: string): void {
    this.notifier.createToast(
      msg,
      NotificationType.WARNING,
      NotificationService.DURATION
    );
  }

  public onDanger(msg: string): void {
    this.notifier.createToast(
      msg,
      NotificationType.DANGER,
      NotificationService.DURATION
    );
  }
}

enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}
