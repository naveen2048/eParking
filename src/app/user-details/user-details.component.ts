import { Component, OnInit } from "@angular/core";
import { Slots } from "../models/Slots.model";
import { SlotService } from "../services/slot.service";
import { Floater } from "../models/Floater.model";
import { Owner } from "../models/Owner.model";
import { DatePipe } from "@angular/common";
import { OwnerTransaction } from "../models/OwnerTransaction.model";
@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"]
})
export class UserDetailsComponent implements OnInit {
  soltDetails: Slots = new Slots();
  floaters: Floater[];
  dedicatedSlots: Owner[];
  OwnerTrans: OwnerTransaction[];
  constructor(private service: SlotService) {}

  ngOnInit() {
    this.getFloaters();
    this.getDedicatedSlots();
    this.getOwnersOnVacation();
  }

  getFloaters() {
    this.service.getFloaters().subscribe(data => {
      this.floaters = data;
      this.soltDetails.TotalSlots = data.length;
      this.soltDetails.AvilableSlots = data.filter(
        data => data.Status == "Open" && data.Type == true
      ).length;
    });
  }
  getDedicatedSlots() {
    this.service.getOwners().subscribe(data => {
      this.dedicatedSlots = data;
    });
  }
  getOwnersOnVacation() {
    this.service.getOwnersOnVacation().subscribe(res => {
      var datePipe = new DatePipe("en-US");
      this.OwnerTrans = res;
      this.OwnerTrans.filter(
        d =>
          datePipe.transform(d.LeaveStartDate, "dd/MM/yyyy") >=
            datePipe.transform(Date.now(), "dd/MM/yyyy") &&
          datePipe.transform(d.LeaveEndDate, "dd/MM/yyyy") <=
            datePipe.transform(Date.now(), "dd/MM/yyyy")
      );
    });
  }
}
