import { StateService } from "./../../services/state.service";
import { FeedbackService } from "./../../services/feedback.service";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
    feedbacks: any = [];
    unfiltered:any = [];

    constructor(
        private feedbackService: FeedbackService,
        private stateService: StateService
    ) {}

    ngOnInit(): void {
        this.stateService.getAllUsers().subscribe((users: any) => {
            let tempFeedbacks: any = [];
            this.feedbackService
                .getAllFeedbacks()
                .subscribe((feedbacks: any) => {
                    feedbacks.forEach((feedback: any) => {
                        users.forEach((user: any) => {
                            if (user.feedback == feedback._id){
                                this.feedbacks.push({
                                    username: user.username,
                                    feedback: feedback,
                                });
                                this.unfiltered.push({
                                    username: user.username,
                                    feedback: feedback,
                                })
                            }
                        });
                    });
                });
        });
    }

    resetFilter(){
        this.feedbacks = [];
        this.unfiltered.forEach((feedback:any)=>{
            this.feedbacks.push(feedback);
        });

        const searchElement : any = document.getElementById('search');
        searchElement.value = '';
        const ratingElement : any = document.getElementById('rating');
        ratingElement.value = '';
        const doYouLikeTheAppElement : any = document.getElementById('doYouLikeTheApp');
        doYouLikeTheAppElement.value = '';
    }

    sortByAsc(){
        const sortByElement:any = document.getElementById("ascending");
        const sortBy = sortByElement.value;
        if(sortBy == 'username'){
            for(let i =0;i<this.feedbacks.length - 1;i++){
                for(let j = i + 1; j < this.feedbacks.length;j++){
                    if(this.feedbacks[i].username > this.feedbacks[j].username){
                       let temp =  this.feedbacks[j];
                       this.feedbacks[j] = this.feedbacks[i];
                       this.feedbacks[i] = temp;
                    }
                }
            }
        }else if(sortBy == 'rating'){
            for(let i =0;i<this.feedbacks.length - 1;i++){
                for(let j = i + 1; j < this.feedbacks.length;j++){
                    if(Number(this.feedbacks[i].feedback.answerOne) < Number(this.feedbacks[j].feedback.answerOne)){
                       let temp =  this.feedbacks[j];
                       this.feedbacks[j] = this.feedbacks[i];
                       this.feedbacks[i] = temp;
                    }
                }
            }
        }

    }

    sortByDesc(){
        const sortByElement:any = document.getElementById("descending");
        const sortBy = sortByElement.value;
        if(sortBy == 'username'){
            for(let i =0;i<this.feedbacks.length - 1;i++){
                for(let j = i + 1; j < this.feedbacks.length;j++){
                    if(this.feedbacks[i].username < this.feedbacks[j].username){
                       let temp =  this.feedbacks[j];
                       this.feedbacks[j] = this.feedbacks[i];
                       this.feedbacks[i] = temp;
                    }
                }
            }
        }else if(sortBy == 'rating'){
            for(let i =0;i<this.feedbacks.length - 1;i++){
                for(let j = i + 1; j < this.feedbacks.length;j++){
                    if(Number(this.feedbacks[i].feedback.answerOne) > Number(this.feedbacks[j].feedback.answerOne)){
                       let temp =  this.feedbacks[j];
                       this.feedbacks[j] = this.feedbacks[i];
                       this.feedbacks[i] = temp;
                    }
                }
            }
        }

    }

    search(){
        console.log("Inside search");
        
        const searchElement : any = document.getElementById('search');
        const searchKeyword = String(searchElement.value);

        if(searchKeyword.trim() == "") return this.resetFilter();

        let newFeedbacks : any = [];

        this.unfiltered.forEach((feedback:any)=>{
            if(feedback.username.toLowerCase().includes(searchKeyword.toLowerCase()) || feedback.feedback.answerThree.toLowerCase().includes(searchKeyword.toLowerCase())){
                newFeedbacks.push(feedback);
            }
        });
        this.feedbacks = newFeedbacks;
    }

    filterByRating(){
        const ratingElement : any = document.getElementById('rating');
        const rating = ratingElement.value;

        if(rating == '')return this.resetFilter();

        let newFeedbacks : any = [];

        this.unfiltered.forEach((feedback:any)=>{
            if(Number(feedback.feedback.answerOne) === Number(rating)){
                newFeedbacks.push(feedback);
            }
        });

        this.feedbacks = newFeedbacks;

    }

    filterByDoYouLikeTheApp(){
        const doYouLikeTheAppElement : any = document.getElementById('doYouLikeTheApp');
        const doYouLikeTheApp = doYouLikeTheAppElement.value;

        if(doYouLikeTheApp == '')return this.resetFilter();

        let newFeedbacks : any = [];

        this.unfiltered.forEach((feedback:any)=>{
            if(feedback.feedback.answerTwo.toLowerCase() === doYouLikeTheApp.toLowerCase()){
                newFeedbacks.push(feedback);
            }
        });

        this.feedbacks = newFeedbacks;
    }


}
