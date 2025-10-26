import { Routes } from '@angular/router';
import { EventForm } from './event-form/event-form';
import { Toolbar } from './toolbar/toolbar';
import { EventList } from './event-list/event-list';

export const routes: Routes = [
  {
    path: '',
    component: Toolbar,
    children: [
      { path: '', redirectTo: 'form', pathMatch: 'full' },
      { path: 'form', component: EventForm },
      { path: 'events', component: EventList }
    ]
  }
];
