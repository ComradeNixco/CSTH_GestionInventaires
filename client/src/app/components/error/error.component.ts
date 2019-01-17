import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  public errId: string;
  public returnUrl: string;

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.errId = this._route.snapshot.paramMap.get('errId');
    this.returnUrl = this._route.snapshot.paramMap.get('returnUrl') || '';
  }
}
