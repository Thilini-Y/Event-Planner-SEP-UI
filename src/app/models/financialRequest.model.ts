export interface Event {
    id? : number;
    contractType: string;
    requestingDepartment: string;
    yearsOfExperience: Float32Array;
    jobTitle: string;
    jobDescription: string;
    status: string;
    hrNotes: string;
    createdAt: Date | null;
    updatedAt: Date | null;    
  }