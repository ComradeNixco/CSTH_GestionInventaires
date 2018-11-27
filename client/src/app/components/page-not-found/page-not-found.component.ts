import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  routeUrl: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.routeUrl = this.router.url;
  }
}
