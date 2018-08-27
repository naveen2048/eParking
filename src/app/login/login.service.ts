import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/observable";
import "rxjs/add/operator/map";
import { ObserveOnMessage } from "rxjs/operators/observeOn";

import { AngularFirestore } from "angularfire2/firestore";
import { UserModel } from "../models/user.model";

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, private fs: AngularFirestore) {}

  loginUser(data: any): Observable<UserModel[]> {
    return this.fs
      .collection<UserModel>("/Users", auth =>
        auth
          .where("username", "==", data.userName)
          .where("password", "==", data.password)
      )
      .valueChanges();
  }
}
