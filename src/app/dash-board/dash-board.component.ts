import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Owner } from '../models/Owner.model';
import { SlotService } from '../services/slot.service';
import { Floater } from '../models/Floater.model';
import { PersistanceService } from '../shared/persistance.service';
import { NotificationService } from "../shared/notification.service";
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  dedicatedSlots: Owner[];
  user: UserModel = new UserModel();
  owner: Owner;
  constructor(private service: SlotService,
    private persistanceService: PersistanceService,
    private notification: NotificationService) { }
  ngOnInit() {
    this.user = this.persistanceService.get('user') as UserModel
    //this.getDedicatedSlots();
  }
  
  bookFloater(slotNumber: string) {

    let success = this.service.bookFloater(this.user, slotNumber);
    if (success)
      this.notification.success(`Slot ${slotNumber} allocated is Successfull`);
    else
      this.notification.error(`Unable to allocated slot ${slotNumber} ,please try after some time`);
  }

  getDedicatedSlots() {
    this.service.getOwners().subscribe(data => {
      this.dedicatedSlots = data;
      this.owner = this.FindOwnerSlot();
    });
  }
  //Find Owner slot on log on.
  FindOwnerSlot(): Owner {
    //this.service.FindOwnerSlot(this.user);
    let owner = null;
    this.dedicatedSlots.forEach(ele => {
      if (ele.EmployeeId == this.user.userId) {
        owner = ele;
      }
    });
    return owner;
  }

  //Deletes record in Floater table and updates slot status in Owners Table and OwnersTransaction table
  ReturnlOwnerSlot() {
    this.service.ReturnlOwnerSlot(this.user).subscribe(res => {
      let success = res;
      if (success) {
        this.notification.success(`Slot cancellation is successfull, Thanks for Sharing your slot`);
      }
      else
        this.notification.error(`Unable to release your solt, please try after some time`);

    });
  }
  //Adds record in OwnerTransction table and updates slot status in Owners Table
  ReleaseOwnerSlot(data: Owner, leaveStartDate: Date, leaveEndDate: Date) {
    let success = this.service.ReleaseOwnerSlot(data, leaveStartDate, leaveEndDate);
    if (success) {
      this.notification.success(`Thank you!!! your Slot ${data.SlotNumber} is released to floaters for the period ${leaveStartDate} to ${leaveEndDate} `);
    }
    else
      this.notification.error(`Not able to release your slot, please try after some time`);
  }
}
