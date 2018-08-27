import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/observable";
import "rxjs/add/operator/map";
import { ObserveOnMessage } from "rxjs/operators/observeOn";
import { AngularFirestore } from "angularfire2/firestore";
import { Floater, Status } from "../models/Floater.model";
import { App } from "../models/UrlConstants.model";
import { Owner } from "../models/Owner.model";
import { FloaterTransaction } from "../models/FloaterTransaction.model";
import { of } from "rxjs/observable/of";
import { DatePipe } from "@angular/common";
import { OwnerTransaction } from "../models/OwnerTransaction.model";
import { UserModel } from "../models/user.model";
import { User } from "firebase/app";
import { retry } from "rxjs/operators";
import { debug } from "util";
import { PersistanceService } from "../shared/persistance.service";
import { element } from 'protractor';

@Injectable()
export class SlotService {
  public FloaterTrans: any[];
  OwnerTrans: OwnerTransaction[];
  Owners: Owner[];
  constructor(
    private http: HttpClient,
    private fs: AngularFirestore,
    private persistanceService: PersistanceService
  ) {}

  //Fetches floaters with id
  getFloaters(): Observable<Floater[]> {
    return this.fs
      .collection<Floater>("/Floaters")
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Floater;
          data.Id = action.payload.doc.id;
          return data;
        });
      });
  }
  //Fetches owners with id
  getOwners(): Observable<Owner[]> {
    return this.fs
      .collection("/Owners")
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Owner;
          data.Id = action.payload.doc.id;
          return data;
        });
      });
  }
  //Fetches floater transactions for today to verify the availbale slots
  getFloaterTrans(date?: Date): Observable<FloaterTransaction[]> {
    var datePipe = new DatePipe("en-US");

    return this.fs
      .collection<FloaterTransaction>("/FloaterTransactions") //, ref => ref.where('SlotBookDateTime','==',Date))
      .valueChanges()
      .map(data => {
        return (this.FloaterTrans = data.filter(
          d =>
            datePipe.transform(d.SlotBookedDateTime, "dd/MM/yyyy") ==
              datePipe.transform(Date.now(), "dd/MM/yyyy") &&
            d.EmployeeId ===
              (<UserModel>this.persistanceService.get("user")).userId
        ));
      });
  }
  //Fetches Owner leave period - according to this period we need to insert daily one record on "Floater" table with slottype "true"
  getOwnersOnVacation(): Observable<OwnerTransaction[]> {
    var datePipe = new DatePipe("en-US");
    return this.fs
      .collection("/OwnersTransaction", ref => ref.where("OnLeave", "==", true))
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as OwnerTransaction;
          data.Id = action.payload.doc.id;
          return data;
        });
      });
    // }).subscribe(res => {
    //     this.OwnerTrans = res;
    //     this.OwnerTrans.filter(d =>
    //         (datePipe.transform(d.LeaveStartDate, "dd/MM/yyyy")
    //             >= datePipe.transform(Date.now(), "dd/MM/yyyy"))
    //         &&
    //         (datePipe.transform(d.LeaveEndDate, "dd/MM/yyyy")
    //             <= datePipe.transform(Date.now(), "dd/MM/yyyy")));
    // });
  }
  //book floater for the log on user.
  bookFloater(user: UserModel, slotNumber: string): Observable<boolean> {
    let ftran = {
      ArrivalDateTime: "",
      CarNumber: user.carnumber,
      EmployeeId: user.userId,
      EmployeeName: user.username,
      Mobile: user.mobilenumber,
      SlotBookedDateTime: new Date(),
      SlotNumber: slotNumber,
      SlotStatus: "Booked",
      CarType: ""
    };

    this.fs
      .collection("/FloaterTransactions")
      .add(ftran)
      .catch(res => {
        return of(false);
      });

    this.getFloaters().subscribe(
      res => {
        // let floater = res.filter(d => {
        //   d.SlotNumber == slotNumber;
        // });
        for (let index = 0; index < res.length; index++) {
           const element = res[index];
          if(element.SlotNumber.toString() == slotNumber) {
            element.Status = "Booked";
            this.fs.doc(`Floaters/${element.Id}`).update(element);
          }
        }

        
      },
      err => of(false)
    );

    return of(true);
  }
  //Find Owner slot on log on.
  // FindOwnerSlot(data: UserModel): Owner {
  //   let owner = null;
  //   this.Owners.forEach(ele => {
  //     if (ele.EmployeeId == data.userId) {
  //       owner = ele;
  //     }
  //   });
  //   return owner;
  // }

  //Deletes record in Floater table and updates slot status in Owners Table and OwnersTransaction table
  ReturnlOwnerSlot(data: UserModel): Observable<boolean> {
    let owntrans = null;
    let floater = null;
    let owner = null;

    this.fs
      .collection<OwnerTransaction>("/OwnersTrans", ref =>
        ref.where("EmployeeId", "==", data.userId).where("OnLeave", "==", true)
      )
      .valueChanges()
      .subscribe(
        res => {
          owntrans = res[0] as OwnerTransaction;
          owntrans.OnLeave = false;
          this.fs
            .collection<Floater>("/Floaters", ref =>
              ref.where("SlotNumber", "==", owntrans.SlotNumber)
            )
            .valueChanges()
            .subscribe(
              res => {
                floater = res[0];
              },
              err => of(false)
            );
          this.fs
            .collection<Owner>("/Owner", ref =>
              ref.where("EmployeeId", "==", data.userId)
            )
            .valueChanges()
            .subscribe(
              res => {
                owner = res[0] as Owner;
                owner.Status = Status.Closed;
              },
              err => of(false)
            );
        },
        err => of(false)
      );
    this.fs.doc(`OwnersTrans/${owntrans.Id}`).update(owntrans);
    this.fs.doc(`Floaters/${floater.Id}`).delete();
    this.fs.doc(`Owner/${owntrans.Id}`).update(owntrans);

    return of(true);
  }
  //Adds record in OwnerTransction table and updates slot status in Owners Table
  ReleaseOwnerSlot(
    data: Owner,
    leaveStartDate: Date,
    leaveEndDate: Date
  ): Observable<boolean> {
    data.Status = Status.Open.toString();
    let entity = new OwnerTransaction();
    entity.EmployeeId = data.EmployeeId;
    entity.EmployeeName = data.EmployeeName;
    entity.LeaveEndDate = leaveEndDate;
    entity.LeaveStartDate = leaveStartDate;
    entity.OnLeave = true;
    entity.SlotNumber = data.SlotNumber;
    entity.Status = Status.Open.toString();
    //entity.MobileNumber = data.MobileNumber;

    this.fs
      .collection("/OwnersTransactions").add(entity);
      
    this.fs
      .doc(`Owner/${data.Id}`)
      .update(data)
      .catch(res => {
        return of(false);
      });

    return of(true);
  }
}
