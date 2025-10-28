import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';


@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  updateEventStatus(id: number, status: string): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}/status/${status}`, {});
  }

   updateEventBudget(eventId: number, body: any): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${eventId}`, body);
  }
}