import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class FeedbackService {
    constructor(private http: HttpClient, private router: Router) {}

    submit(feedback: any) {
        this.http
            .post("http://localhost:3000/feedbacks", feedback, {
                headers: {
                    token: String(localStorage.getItem("token")),
                },
            })
            .subscribe((data: any) => {
                let user = JSON.parse(String(localStorage.getItem("user")));
                user.feedback = data._id;
                localStorage.removeItem("user");
                localStorage.setItem("user", JSON.stringify(user));
                this.router.navigate(["home"]);
            });
    }

    getAllFeedbacks() {
        return this.http.get("http://localhost:3000/feedbacks", {
            headers: {
                token: String(localStorage.getItem("token")),
            },
        });
    }
}
