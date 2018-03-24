import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from './../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FlowerService {
  constructor(private http: HttpClient) { }

    getFlowers(): Observable<Object[]>{
      var url  
      if(environment.serverURL){
          url = `${environment.serverURL}/flower`;
        }else{
          url = "/flower"
        }
        return this.http.get<Object[]>(url)
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
