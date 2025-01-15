import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { TripPlannerComponent } from './trip-planner/trip-planner.component';
import { DeparturesComponent } from './departures/departures.component';
import { DelayStatisticsComponent } from './delay-statistics/delay-statistics.component';
import { HolidaysComponent } from './admin/holidays/holidays.component';
import { StopsComponent } from './admin/stops/stops.component';
import { RoutesComponent } from './admin/routes/routes.component';
import { canNavigateToAdminGuard } from './can-navigate-to-admin.guard';
import { LoginComponent } from './login/login.component';
import { HolidayFormComponent } from './admin/holidays/holiday-form/holiday-form.component';
import { StopFormComponent } from './admin/stops/stop-form/stop-form.component';
import { RouteFormComponent } from './admin/routes/route-form/route-form.component';
import { RouteDetailsComponent } from './admin/routes/route-details/route-details.component';
import { GpsSearchComponent } from './stop-search/gps-search/gps-search.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'trip-planner',
        pathMatch: 'full'
    },
    {
        path: 'index.html',
        redirectTo: 'admin',
        pathMatch: 'full'
    },
    {
        path: 'trip-planner',
        component: TripPlannerComponent
    },
    {
        path: 'departures',
        component: DeparturesComponent
    },
    {
        path: 'delay-statistics',
        component: DelayStatisticsComponent
    },
    {
        path: 'departures',
        component: GpsSearchComponent
    },
    { 
        path: 'login',  
        component: LoginComponent
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate:[canNavigateToAdminGuard],
        children: [
            { path: 'holidays', component: HolidaysComponent },
            { path: 'holidays/add', component: HolidayFormComponent },
            { path: 'holidays/:id', component: HolidayFormComponent },
            { path: 'stops', component: StopsComponent },
            { path: 'stops/add', component: StopFormComponent },
            { path: 'stops/:shortName', component: StopFormComponent },
            { path: 'routes', component: RoutesComponent },
            { path: 'routes/add', component: RouteFormComponent },
            { path: 'routes/:routeNumber', component: RouteDetailsComponent },
        ]
    }
];