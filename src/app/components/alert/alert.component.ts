import { StateService } from './../../services/state.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  message:string = '';
  display:string = "hide"

  constructor(private stateService:StateService) { 
  }

  ngOnInit(): void {
    this.stateService.alertMessage.subscribe(data => { this.setMessage(data)});
  }

  setMessage(message:string){
    if(message === '') return;
    this.message = message;
    this.display = "show";
  }

  close():void{
    this.display = "hide";
    this.stateService.setAlertMessage('');
  }

}
