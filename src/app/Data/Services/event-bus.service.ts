import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subjects: { [key: string]: Subject<any> } = {};

  private GetSubject<T>(eventName: string): Subject<T> {
    if (!this.subjects[eventName]) {
      this.subjects[eventName] = new Subject<T>();
    }
    return this.subjects[eventName] as Subject<T>;
  }

  public On<T>(eventName: string): Observable<T> {
    return this.GetSubject<T>(eventName).asObservable();
  }

  public Emit<T>(eventName: string, data: T) {
    this.GetSubject<T>(eventName).next(data);
  }
}
