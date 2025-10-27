import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinancialRequest } from '../models/financialRequest.model';


@Injectable({ providedIn: 'root' })
export class FinancialRequestService {
  private apiUrl = 'http://localhost:8080/api/financial-requests';

  constructor(private http: HttpClient) {}

  createFinancialRequest(financialRequest: FinancialRequest): Observable<FinancialRequest> {
    return this.http.post<FinancialRequest>(this.apiUrl, financialRequest);
  }

  getAllFinancialRequests(): Observable<FinancialRequest[]> {
    return this.http.get<FinancialRequest[]>(this.apiUrl);
  }

  updateFinancialRequestStatus(id: number, status: string): Observable<FinancialRequest> {
    const body = {status: status};
    return this.http.put<FinancialRequest>(`${this.apiUrl}/${id}/status`, body);
  }

  updateFinancialRequest(id: number, financialRequest: FinancialRequest): Observable<FinancialRequest> {
    return this.http.put<FinancialRequest>(`${this.apiUrl}/${id}`, financialRequest);
  }

  getFinancialRequestById(id: number): Observable<FinancialRequest> {
    return this.http.get<FinancialRequest>(`${this.apiUrl}/${id}`);
  }
}