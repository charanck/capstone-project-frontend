import { StateService } from "./state.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class UserService {
    constructor(
        private http: HttpClient,
        private stateService: StateService,
        private router: Router
    ) {}

    signUp(
        username: string,
        email: string,
        gender: string,
        password: string,
        role: string
    ) {
        const body = {
            username: username,
            email: email,
            gender: gender,
            password: password,
            role: role,
        };
        return this.http.post(
            `${this.stateService.getServerURI()}/users/signup`,
            body
        );
    }

    login(username: string, password: string, rememberMe: boolean) {
        const body = {
            username: username,
            password: password,
            rememberMe: rememberMe,
        };
        return this.http.post(
            `${this.stateService.getServerURI()}/users/login`,
            body
        );
    }

    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.router.navigate(["login"]);
    }

    deactivate() {}

    update(user: any) {
        this.http
            .put(`http://localhost:3000/users/${user.id}`, user, {
                headers: {
                    token: String(localStorage.getItem("token")),
                },
            })
            .subscribe((data) => {
                this.reloadComponent();
            });
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = "reload";
        this.router.navigate([currentUrl]);
    }
}
