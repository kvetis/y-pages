import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { shareReplay, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

const BUSINESSES_DATA = '/assets/businesses-data.json';
const REVIEWS_DATA = '/assets/reviews-data.json';

@Injectable()
export class CompanyService {

  private companySource: Observable<Company[]>;
  private reviewSource: Observable<Map<number, number>>;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.companySource = this.httpClient
      .get<Company[]>(BUSINESSES_DATA)
      .pipe(
        shareReplay(1),
      );


    this.reviewSource = this.getReviewSource();
  }

  public getCompanies() {
    return this.companySource;
  }

  public getCompany(id: number): Observable<ReviewedCompany> {
    return this.companySource.pipe(
      map(companies => {
        const company = companies.find(c => c.id === id);
        if (!company) {
          throw new Error(`Cannot find company with id '${id}'`);
        }
        return company;
      }),
      mergeMap(company => this.reviewSource.pipe(
        map(reviews => reviews.get(id)),
        map(review => ({ ...company, score: review }))
      )),
    );
  }

  public getCategories() {
    return this.companySource.pipe(
      map(companies => {
        const cats = companies.map(company => company.category);
        const set = new Set<string>(cats);
        return Array.from(set.values());
      })
    );
  }

  private getReviewSource() {
    return this.httpClient
      .get<ReviewsData>(REVIEWS_DATA)
      .pipe(
        map(data => this.processReviews(data)),
        shareReplay(1)
      );
  }

  private processReviews(reviews: ReviewsData) {
    // Mapped by business id
    const grouped = (Object.values(reviews) as Review[][])
      .reduce(
        (all, current) =>
          all = all.concat(current), new Array<Review>()
      )
      .reduce((all, current) => {
        if (!all.has(current.business_id)) {
          all.set(current.business_id, new Array<Review>());
        }
        all.get(current.business_id).push(current);
        return all;
      }, new Map<number, Review[]>());

    // Process groups
    const companyReviews = Array.from(grouped.values())
      .reduce((all, current) => {
        // calculate average - this should be better algo - but avg
        // is enough for demonstration sake
        const total = current.reduce((sum, review) => sum + review.score, 0);
        all.push([current[0].business_id, total / current.length]);

        return all;
      }, new Array<[number, number]>());

    return new Map<number, number>(companyReviews);
  }


}

export interface Company {
  id: number;
  name: string;
  category: string;
  city: string;
  country: string;
  description: string;
  href: string;
  imageUrl: string;
}

export interface ReviewedCompany extends Company {
  score?: number;
}

interface ReviewsData {
  [key: string]: Review[];
}

interface Review {
  business_id: number;
  score: number;
}
