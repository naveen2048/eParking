import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class NotificationService {
    private _duration:number = 5000;

    constructor(private notifier:ToastrService,
                private snackBar:MatSnackBar){}

    success(msg:string) {
        this.notifier.success(msg,"Success",{closeButton:true,progressBar:true});
        //this.snackBar.open(msg,null,{duration:this._duration, extraClasses:['background-green']});
    }

    error(msg:string) {
        this.notifier.error(msg,"Error:",{closeButton:false,progressBar:true});
        //this.snackBar.open(msg,null,{duration:this._duration, extraClasses:['background-red']});
    }

    warning(msg:string) {
        this.notifier.warning(msg,"Warning",{closeButton:true,progressBar:true});
        //this.snackBar.open(msg,null,{duration:this._duration, extraClasses:['background-red']});
    }
}