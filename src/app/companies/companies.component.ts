import { Component, OnInit } from '@angular/core';
import { CompanyService, Company } from '../company.service';
import { Observable, combineLatest, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  public companySource$: Observable<Company[]>;
  public categorySource$: Observable<string[]>;
  public categoryControl = new FormControl('');
  public sort: SortOrder;
  public sortOrder = SortOrder;

  private sortSubject = new Subject<SortOrder>();

  constructor(
    private companyService: CompanyService,
  ) { }

  ngOnInit() {
    this.categorySource$ = this.companyService.getCategories();
    this.companySource$ = combineLatest(
      this.companyService.getCompanies(),
      this.categoryControl.valueChanges.pipe(
        startWith(null),
      ),
      this.sortSubject.pipe(
        startWith(null),
      ),
    ).pipe(
      map(data => {
        const [companies, category, sort] = data;
        let result = companies;
        if (category) {
          result = companies.filter(company => company.category === category);
        }

        if (sort) {
          result = this.sortData(result, sort);
        }

        return result;
      })
    );
  }

  public changeSort() {
    if (this.sort === SortOrder.Asc) {
      this.sort = SortOrder.Desc;
    } else {
      this.sort = SortOrder.Asc;
    }
    this.sortSubject.next(this.sort);
  }

  private sortData(companies: Company[], order: SortOrder) {
    if (!order) {
      return companies;
    }
    return companies.slice().sort((a, b) => {
      const modifier = order === SortOrder.Desc ? -1 : 1;

      if (a.name < b.name) {
        return modifier * -1;
      } else if (a.name > b.name) {
        return modifier;
      }
      return 0;
    });
  }

}

enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}


