import { Component, OnInit } from '@angular/core';
import { PersistanceService } from '../shared/persistance.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-header-navigation',
  templateUrl: './header-navigation.component.html',
  styleUrls: ['./header-navigation.component.css']
})
export class HeaderNavigationComponent implements OnInit {
  welcome:string;

  constructor(private persistanceService:PersistanceService) { }

  ngOnInit() {
    let user = <UserModel>this.persistanceService.get("user");
    this.welcome =  user.lastName + "," + user.firstName;
  }

  logout() {
    this.persistanceService.clear();
  }
}
