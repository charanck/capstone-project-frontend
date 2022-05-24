import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SetupWSService {
  private socket:any = null;
  constructor(
    private webSocketService: WebsocketService,
    private router: Router,
    private http:HttpClient
  ) {}

  setUpWs() {
    // initial connection
    this.webSocketService.init();
    this.socket = this.webSocketService.socket;

    // Listenig to receive Messages
    this.webSocketService.listen('receiveMessage').subscribe((data: any) => {
      let messages = JSON.parse(String(sessionStorage.getItem('messages')));
      messages.push(data);
      sessionStorage.removeItem('messages');
      sessionStorage.setItem('messages', JSON.stringify(messages));
      this.reloadComponent();
    });

    // Listening to receive Attachment
    this.webSocketService.listen('receiveAttachment').subscribe((data: any) => {
      let attachments = JSON.parse(
        String(sessionStorage.getItem('attachments'))
      );
      attachments.push(data);
      sessionStorage.removeItem('attachments');
      sessionStorage.setItem('attachments', JSON.stringify(attachments));
      this.reloadComponent();
    });

    // listening to user connected event
    this.webSocketService.listen('userConnected').subscribe((data: any) => {
      this.reloadComponent();
    });

    // listening to message delete event
    this.webSocketService.listen('deleteMessage').subscribe((data: any) => {
      this.reloadComponent();
    });

    // listening to attachment deleted event
    this.webSocketService.listen('deleteAttachment').subscribe((data: any) => {
      this.reloadComponent();

    });

    // listening to user disconnected event
    this.webSocketService.listen('userDisconnected').subscribe((data: any) => {
      this.reloadComponent();
    });

    // Sending Message

    // sending attachment

    // Deleting message

    // deleting attachment
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  sendMessage(data:any){
    this.webSocketService.emit('sendMessage',data);
    this.http.post("http://localhost:3000/messages",data,{
      headers:{
        token:String(localStorage.getItem('token'))
      }
    }).subscribe(data =>{
      this.reloadComponent();
    })
  }

  deleteMessage(messageId:string){
    this.http.delete(`http://localhost:3000/messages/${messageId}`,{
      headers:{
        token:String(localStorage.getItem('token'))
      }
    }).subscribe(data =>{
      this.reloadComponent();
    })
  }

  deleteAttachment(attachmentId:string){
    this.http.delete(`http://localhost:3000/attachments/${attachmentId}`,{
      headers:{
        token:String(localStorage.getItem('token'))
      }
    }).subscribe(data =>{
      this.reloadComponent();
    })
  }

  sendAttachment(formdata:any){
    this.http.post("http://localhost:3000/attachments",formdata,{
      headers:{
        token:String(localStorage.getItem('token'))
      }
    }).subscribe(data =>{
      this.reloadComponent();
    });
  }
}
