import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from "@angular/core";
import { PersistanceService } from "./shared/persistance.service";
import { Observable } from "rxjs/observable";
import { HeaderNavigationComponent } from "./header-navigation/header-navigation.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  entryComponents: []
})
export class AppComponent {

  title = "app";
  showNav: Observable<boolean>;
  persistanceService: PersistanceService;

  constructor(
    private _persistanceService: PersistanceService,
    private r: ComponentFactoryResolver,
    private nc:ViewContainerRef
  ) {
    this.persistanceService = _persistanceService;
  }

  logout() {
    this.persistanceService.clear();
  }
}
