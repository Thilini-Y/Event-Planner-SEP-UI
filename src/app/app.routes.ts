import { Routes } from '@angular/router';
import { EventForm } from './event-form/event-form';
import { Toolbar } from './toolbar/toolbar';
import { EventList } from './event-list/event-list';
import { RecruitmentRequestForm } from './recruitment-request-form/recruitment-request-form';
import { RecruitmentRequestList } from './recruitment-request-list/recruitment-request-list';
import { FinancialRequestForm } from './financial-request-form/financial-request-form';
import { FinancialRequestList } from './financial-request-list/financial-request-list';
import { CreateTaskComponent } from './create-task/create-task';
import { TaskList } from './task-list/task-list';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: Toolbar,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'form', component: EventForm },
      { path: 'events', component: EventList },
      { path: 'recruitment', component: RecruitmentRequestForm },
      { path: 'recruitment-list', component: RecruitmentRequestList },
      { path: 'financial-request', component: FinancialRequestForm },
      { path: 'financial-list', component: FinancialRequestList },
      { path: 'create-task', component: CreateTaskComponent },
      { path: 'task-list', component: TaskList }
    ]
  }
];
