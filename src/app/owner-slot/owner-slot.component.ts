import { Component, OnInit } from "@angular/core";
import { MatDatepicker } from "@angular/material";
import { PersistanceService } from "../shared/persistance.service";
import { UserModel } from "../models/user.model";
import { SlotService } from "../services/slot.service";
import { Owner } from "../models/Owner.model";
import { NotificationService } from "../shared/notification.service";

@Component({
  selector: "app-owner-slot",
  templateUrl: "./owner-slot.component.html",
  styleUrls: ["./owner-slot.component.css"]
})
export class OwnerSlotComponent implements OnInit {
  filterDate1:any;
  filterDate:any;
  
  user: UserModel;
  owner = new Owner();
  constructor(
    private persistanceService: PersistanceService,
    private slots: SlotService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.user = this.persistanceService.get("user") as UserModel;
  }

  Release() {
    //this.user = this.persistanceService.get("user") as UserModel;
    debugger;
    this.slots.ReleaseOwnerSlot(this.owner, new Date(), new Date()).subscribe(
      data => {
        this.notification.success("Release successfully");
      },
      error => {
        this.notification.error("Something went wrong, please try again.");
      }
    );
  }
}
