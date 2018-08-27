import { Injectable } from "@angular/core";
import { UserModel } from "../models/user.model";
import { Router } from "@angular/router";
import { Observable } from "rxjs/observable";
import { of } from "rxjs/observable/of";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class PersistanceService {
  IsAuthenticated: boolean;
  private loggedIn = new BehaviorSubject<boolean>(true);

  constructor(private router: Router) {}

  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      
      //set Authenticated to true
      this.IsAuthenticated = true;
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error("Error getting data from localStorage", e);
      return null;
    }
  }

  isAuthenticated() {
    var auth = this.get("user") as UserModel;
    if (auth != null && auth.firstName != "") {
      return this.loggedIn.asObservable();
    }
    return this.loggedIn.next(false);
  }

  clear() {
    localStorage.clear();
    this.IsAuthenticated = false;
    this.router.navigateByUrl("/login");
  }
}
