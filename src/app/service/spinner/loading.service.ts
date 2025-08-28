import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<string>('Loading...');
  loading$ = this._loading.asObservable();
  message$ = this._message.asObservable();

  show(message = 'Loading...') {
    this._message.next(message);
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}
