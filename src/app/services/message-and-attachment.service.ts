import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageAndAttachmentService {
  messageTo = "";

  constructor(private http:HttpClient) { }

  getMessagesAndAttachments(){
    return this.http.get(`http://localhost:3000/messages/${this.messageTo}`,{
      headers:{
        token:String(localStorage.getItem('token'))
      }
    });
  }

  setMessageTo(messageTo:string){
    this.messageTo = messageTo;
  }
}
