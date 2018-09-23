import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CompanyService, ReviewedCompany } from '../company.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyDetailResolver implements Resolve<ReviewedCompany> {
  constructor(
    private companyService: CompanyService,
  ) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<ReviewedCompany> {
    return this.companyService.getCompany(
      parseInt(route.paramMap.get('id'), 10)
    );
  }
}
