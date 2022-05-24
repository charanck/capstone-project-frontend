import { FeedbackService } from './../../services/feedback.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  rateTheApplication:any = null;
  doYouLikeTheApplication:any = null;
  anySuggestionForImprovement:any = null;

  constructor(private feedbackService:FeedbackService,private router: Router,) { 
    if (!localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
  }

  ngOnInit(): void {
  }

  updateRateTheApplication(){
    const ratingElement: any = document.getElementById('rating');
    this.rateTheApplication = ratingElement.value;
  }

  updateDoYouLikeTheApplication(){
    const doYouLikeTheApplicationElement: any = document.getElementById('doYouLikeTheApplication');
    this.doYouLikeTheApplication = doYouLikeTheApplicationElement.value;
  }

  updateAnySuggestionForImprovement(){
    const anySuggestionForImprovementElement: any = document.getElementById('anySuggestionForImprovement');
    this.anySuggestionForImprovement = anySuggestionForImprovementElement.value; 
  }

  submit(){
    const feeback:any = {
      answerOne : this.rateTheApplication,
      answerTwo : this.doYouLikeTheApplication,
      answerThree : this.anySuggestionForImprovement
    }
    this.feedbackService.submit(feeback);
  }

}
