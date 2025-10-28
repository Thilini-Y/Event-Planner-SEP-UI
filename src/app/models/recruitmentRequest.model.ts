export interface RecruitmentRequest {
    id? : number;
    contractType: string; // Full-time/Part-time
    requestingDepartment: string; // Production, Services
    yearsOfExperience: number;
    jobTitle: string;
    jobDescription: string;
    status: RecruitmentStatus;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }

export enum RecruitmentStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
    REJECTED = "REJECTED",
}