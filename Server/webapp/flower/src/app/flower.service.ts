import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from './../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FlowerService {
  baseURL = ""
  constructor(private http: HttpClient) { 
    if(environment.serverURL){
      this.baseURL = environment.serverURL
    }
  }

    getOverview(): Observable<Object>{
      return this.http.get<Object>(`${this.baseURL}/overview`)
    }

    getFlowers(): Observable<Object[]>{
      return this.http.get<Object[]>(`${this.baseURL}/flower`)
              .pipe(
                  tap(flowers => console.log("Fetched Flowers from server")),
                  catchError(this.handleError('getFlowers',[]))
              )
    }

    /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
