# Staff Recruitment Management Flow

## Overview

This document describes the Staff Recruitment Management system where SM/PM can submit recruitment requests to HR, and HR can manage these requests.

## Frontend Components Created

### 1. Recruitment Request Form (`/recruitment`)

**Purpose:** SM/PM can submit recruitment requests to HR

**Fields:**

- Contract Type (Full-time/Part-time dropdown)
- Requesting Department (Production/Services dropdown)
- Years of Experience (number input)
- Job Title (text input)
- Job Description (textarea)

**Functionality:**

- Form submission saves the request to the database
- Success/error notifications
- Form reset after successful submission

### 2. Recruitment Request List (`/recruitment-list`)

**Purpose:** HR can view and manage recruitment requests

**Features:**

- Display all recruitment requests in a table
- Shows: Job Title, Department, Contract Type, Years of Experience, Status
- HR can change the status of any request via dropdown:
  - Open (default when created)
  - In Progress
  - Closed
  - Rejected
- Status changes are saved to the database
- View Job Description button to see full description
- Color-coded status indicators

## Data Model

```typescript
RecruitmentRequest {
  id?: number;
  contractType: string; // "Full-time" or "Part-time"
  requestingDepartment: string; // "Production" or "Services"
  yearsOfExperience: number;
  jobTitle: string;
  jobDescription: string;
  status: RecruitmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Status Enum

- OPEN: Initial status when request is created
- IN_PROGRESS: HR has started processing/interviewing
- CLOSED: Successfully hired
- REJECTED: Request is rejected

## Workflow

1. **SM/PM submits request**

   - Navigate to "Recruitment Request" page
   - Fill out form with job details
   - Submit → Request saved to DB with status "Open"

2. **HR reviews requests**

   - Navigate to "Recruitment List" page
   - View all pending requests
   - See job details including description

3. **HR manages status**
   - Change status dropdown to update progress
   - Can set to "In Progress" during interviews
   - Can set to "Closed" when position is filled
   - Can set to "Rejected" if not hiring

## API Endpoints (Expected Backend)

The service expects these endpoints:

- `POST /api/recruitment-requests` - Create new request
- `GET /api/recruitment-requests` - Get all requests
- `PUT /api/recruitment-requests/{id}/status/{status}` - Update status
- `PUT /api/recruitment-requests/{id}` - Update entire request
- `GET /api/recruitment-requests/{id}` - Get specific request

## Navigation

Access the recruitment features from the toolbar:

- **Recruitment Request** - Submit new requests (SM/PM)
- **Recruitment List** - Manage requests (HR)
