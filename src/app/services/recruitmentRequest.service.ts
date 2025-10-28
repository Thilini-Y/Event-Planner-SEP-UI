import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecruitmentRequest } from '../models/recruitmentRequest.model';


@Injectable({ providedIn: 'root' })
export class RecruitmentRequestService {
  private apiUrl = 'http://localhost:8080/api/recruitment-requests';

  constructor(private http: HttpClient) {}

  createRecruitmentRequest(recruitmentRequest: RecruitmentRequest): Observable<RecruitmentRequest> {
    return this.http.post<RecruitmentRequest>(this.apiUrl, recruitmentRequest);
  }

  getAllRecruitmentRequests(): Observable<RecruitmentRequest[]> {
    return this.http.get<RecruitmentRequest[]>(this.apiUrl);
  }

  updateRecruitmentRequestStatus(id: number, status: string): Observable<RecruitmentRequest> {
    const body = {status: status};
    return this.http.put<RecruitmentRequest>(`${this.apiUrl}/${id}/status`, body);
  }

  updateRecruitmentRequest(id: number, recruitmentRequest: RecruitmentRequest): Observable<RecruitmentRequest> {
    return this.http.put<RecruitmentRequest>(`${this.apiUrl}/${id}`, recruitmentRequest);
  }

  getRecruitmentRequestById(id: number): Observable<RecruitmentRequest> {
    return this.http.get<RecruitmentRequest>(`${this.apiUrl}/${id}`);
  }
}