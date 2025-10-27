export interface FinancialRequest {
    id? : number;
    requestingDepartment: string; // PRODUCTION, SERVICES
    projectReference: string; // ProjectID
    requiredAmount: number;
    reason: string;
    status: FinancialStatus;
    fmNotes?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }

export enum FinancialStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}