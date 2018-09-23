import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyService } from './company.service';
import { HttpClientModule } from '@angular/common/http';
import { CompanyCardComponent } from './company-card/company-card.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyDetailResolver } from './company-detail/company-detail.resolver';

const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '/companies',
    pathMatch: 'full',
  },
  {
    path: 'companies',
    component: CompaniesComponent,
  },
  {
    path: 'companies/:id',
    component: CompanyDetailComponent,
    resolve: {
      company: CompanyDetailResolver,
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CompaniesComponent,
    CompanyCardComponent,
    CompanyDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [
    CompanyService,
    CompanyDetailResolver,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
