import { Component, OnInit } from "@angular/core";
import { LoginService } from "./login.service";
import { Router } from '@angular/router'
import { Observable } from 'rxjs/observable';
import { UserModel } from "../models/user.model";
import { NotificationService } from "../shared/notification.service";
import { SlotService } from "../services/slot.service";
import { PersistanceService } from '../shared/persistance.service';



@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  token: UserModel;

  loginDetails: any = {
    userName: "",
    password: "",
    rememberMe: false
  };
  constructor(private loginService: LoginService,
              private router:Router,
              private notification:NotificationService,
              private slotService:SlotService,
              private persistanceService:PersistanceService) {

                if(this.persistanceService.isAuthenticated()){
                  this.router.navigateByUrl("/dashboard");
                }
              }

  ngOnInit() {}

  login() {
    this.loginService.loginUser(this.loginDetails).subscribe(data => {
      debugger;
      if(data.length > 0) {
        this.token = data[0];
        //save to storage
        this.persistanceService.set("user", this.token);

        //this.slotService.getFloaterTrans().subscribe(floater => console.log(floater));

        this.router.navigateByUrl("/dashboard");
      }
      else {
        //credentials error
        this.notification.error("Please check your username/password and try again");
      }
    });
  }
}
