import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from "angularfire2";
import { MatMomentDateModule } from "@angular/material-moment-adapter"; 
import {
  AngularFirestore,
  AngularFirestoreModule
} from "angularfire2/firestore";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { DashBoardComponent } from "./dash-board/dash-board.component";
import { LoadingModule } from "ngx-loading";
import { ToastrModule } from "ngx-toastr";
import {
  NgProgressModule,
  NgProgressBrowserXhr,
  NgProgressInterceptor
} from "ngx-progressbar";
import {
  MatExpansionModule,
  MatCardModule,
  MatTabsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatInputModule,
  MatSnackBarModule,
  MatDialogModule,
  MatButtonModule,
  MatSliderModule,
  MatIconModule,
  MatChipsModule
} from "@angular/material";

import { UserDetailsComponent } from "./user-details/user-details.component";
import { ParkingLayoutComponent } from "./parking-layout/parking-layout.component";
import { environment } from "../environments/environment";
import { LoginService } from "./login/login.service";
import { NotificationService } from "./shared/notification.service";
import { SlotService } from "./services/slot.service";
import { PersistanceService } from "./shared/persistance.service";
import { HeaderNavigationComponent } from "./header-navigation/header-navigation.component";
import { AuthGaurd } from "./shared/authGaurd.service";
import { SlotsComponent } from './slots/slots.component';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { OwnerSlotComponent } from './owner-slot/owner-slot.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "dashboard",
    component: DashBoardComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: "slots",
    component: SlotsComponent,
    canActivate: [AuthGaurd]
  },
  { path: "**", component: LoginComponent }
];

@NgModule({
  declarations: [
        AppComponent,
    LoginComponent,
    DashBoardComponent,
    UserDetailsComponent,
    ParkingLayoutComponent,
    HeaderNavigationComponent,
    SlotsComponent,
    OwnerSlotComponent
  ],
  imports: [
      BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    MatChipsModule,
    MatMomentDateModule,
    HttpClientModule,
    LoadingModule,
    NgProgressModule,
    ModalDialogModule.forRoot(),
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.config),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    LoginService,
    NotificationService,
    SlotService,
    PersistanceService,
    AuthGaurd
  ],
  bootstrap: [AppComponent],
  entryComponents: [HeaderNavigationComponent, ParkingLayoutComponent,OwnerSlotComponent]
})
export class AppModule {}
