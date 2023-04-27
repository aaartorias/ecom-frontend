import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})

export class CheckoutFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let months: number[] = [];
    for (let month = startMonth; month <= 12; ++month) {
      months.push(month);
    }
    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {
    let years: number[] = [];

    let startYear: number = new Date().getFullYear();
    let endYear: number = new Date().getFullYear() + 10;

    for (let year = startYear; year <= endYear; ++year) {
      years.push(year);
    }

    return of(years);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    console.log(`getStates : ${searchStatesUrl}`)
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
