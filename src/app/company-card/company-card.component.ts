import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../company.service';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css']
})
export class CompanyCardComponent implements OnInit {
  @Input()
  public company: Company;

  constructor() { }

  ngOnInit() {
  }

}
