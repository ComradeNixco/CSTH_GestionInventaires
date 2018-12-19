import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  public errId: string;

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.errId = this._route.snapshot.paramMap.get('errId');
  }
}
