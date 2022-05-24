import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public socket: any;
  readonly socketURI: string = 'ws://localhost:3000';

  constructor() {
  }

  init() {
    this.socket = io(this.socketURI, {
      extraHeaders: {
        token: String(localStorage.getItem('token')),
      },
    });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, JSON.stringify(data));
  }
}
