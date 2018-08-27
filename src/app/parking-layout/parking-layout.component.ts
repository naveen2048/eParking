import { Component, OnInit } from "@angular/core";
import { Owner } from "../models/Owner.model";
import { UserModel } from "../models/user.model";
import { SlotService } from "../services/slot.service";
import { PersistanceService } from "../shared/persistance.service";
import { NotificationService } from "../shared/notification.service";
import { Floater } from "../models/Floater.model";
import { FloaterTransaction } from '../models/FloaterTransaction.model';

@Component({
  selector: "app-parking-layout",
  templateUrl: "./parking-layout.component.html",
  styleUrls: ["./parking-layout.component.css"]
})
export class ParkingLayoutComponent implements OnInit {
  totalCars = [];
  // <Floater[]>Array(22)
  //   .fill(0)
  //   .map((x, i) => {
  //     return { "slot": i, "status":"Open", "type":false }
  //   } );

  floaters: Floater[];

  dedicatedSlots: Owner[];
  user: UserModel = new UserModel();
  owner: Owner;
  constructor(
    private service: SlotService,
    private persistanceService: PersistanceService,
    private notification: NotificationService
  ) {}
  ngOnInit() {
    this.user = this.persistanceService.get("user") as UserModel;
    this.getDedicatedSlots();
    this.getFloaters();
  }

  selectedParking(slotNumber: string) {
    this.service.getFloaterTrans().subscribe(data => {
      debugger;
      if (this.service.FloaterTrans.length === 0) {
        this.service.bookFloater(this.user, slotNumber).subscribe(
          res => {
            if (res)
              this.notification.success(
                `Slot ${slotNumber} allocated is Successfull`
              );
              this.showRemainingTime(slotNumber);
          },
          error => this.notification.error(`Error: ${error}`)
        );
      } else {
        this.notification.error(
          `Unable to allocated slot ${slotNumber} ,please try after some time`
        );
      }
    });
  }

  getFloaters() {
    this.service.getFloaters().subscribe(data => {
      this.floaters = data;
      this.totalCars = data;
      console.log(data);
      // console.log(data);
      // //update totalcars with status and type
      // this.floaters.map(d => {
      //   this.totalCars.forEach(c => {
      //       if(c.slot === d.SlotNumber){
      //         c.status = d.Status
      //       }
      //   })
      // })
    });
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
        this.notification.success(
          `Slot cancellation is successfull, Thanks for Sharing your slot`
        );
      } else
        this.notification.error(
          `Unable to release your solt, please try after some time`
        );
    });
  }
  //Adds record in OwnerTransction table and updates slot status in Owners Table
  ReleaseOwnerSlot(data: Owner, leaveStartDate: Date, leaveEndDate: Date) {
    let success = this.service.ReleaseOwnerSlot(
      data,
      leaveStartDate,
      leaveEndDate
    );
    if (success) {
      this.notification.success(
        `Thank you!!! your Slot ${
          data.SlotNumber
        } is released to floaters for the period ${leaveStartDate} to ${leaveEndDate} `
      );
    } else
      this.notification.error(
        `Not able to release your slot, please try after some time`
      );
  }

  setImage(s: string) {
    //let x = s === "Open" ? "car" : s === "Booked" ? "car-red" : s === "Dedicated" ? "dedicated" : "disabled";
    switch (s) {
      case "Open":
        return "car";
      case "Booked":
        return "car-red";
      case "Dedicated":
        return "dedicated";
      default:
        return "disabled";
    }
  }

  showRemainingTime(slotNumber: string) {
    this.service.getFloaterTrans().subscribe(res => {
      let FloaterTrans = res;

      let newTrans: FloaterTransaction[];
      let timers = new Array();
      // this.service.FloaterTrans.filter(d => { d.SlotNumber == slotNumber && d.Status == "Booked" && d.EmployeeId==this.user.userId });
      for (let index = 0; index < FloaterTrans.length; index++) {
        const element = FloaterTrans[index];
        if (
          element.SlotNumber == slotNumber &&
          element.SlotStatus == "Booked" &&
          element.EmployeeId == this.user.userId
        ) {
          newTrans.push(element);
        }
      }
      newTrans[0].SlotBookedDateTime.setHours(3);
      var countDownDate = new Date(
        newTrans[0].SlotBookedDateTime.setHours(3)
      ).getTime();

      // Update the count down every 1 second
      var x = setInterval(function() {
        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        this.countdown = hours + "h " + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
        }
      }, 1000);
    });
  }
}
