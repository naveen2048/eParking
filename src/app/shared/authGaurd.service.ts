import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/observable'
import { PersistanceService } from '../shared/persistance.service';
//import { IUserDetails } from '../login/login.service';
import { NotificationService } from './notification.service';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthGaurd implements CanActivate {

    constructor(private persistanceService: PersistanceService, 
                private router:Router,
                private notification:NotificationService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        var user = this.persistanceService.get('user') as UserModel; 
        
        if(user != undefined || user != null) { return true; }
        else {
            this.notification.error("Please login to access application");
            this.persistanceService.IsAuthenticated = false;
            //this.persistanceService.eventNotify(false);
            this.router.navigateByUrl("/login");
        }
        return false;
    }  
}