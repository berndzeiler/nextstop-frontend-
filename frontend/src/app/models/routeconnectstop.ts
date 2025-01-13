import { Stop } from './stop';
import { DailyValidity } from './route';

export interface RouteConnectStop extends Stop {
    routeNumber?: number; 
    departureTime: string; 
}

export interface RouteStopsDetails {
    startStop?: RouteConnectStop | null; // First stop based on StopSequence
    endStop?: RouteConnectStop | null;   // Last stop based on StopSequence
    stops: RouteConnectStop[];           // Alle Stops der Route
}

export interface RouteConnectStopForCreation {
    route: {
        validFrom: string; // Format: yyyy-MM-dd
        validUntil: string; // Format: yyyy-MM-dd
        dailyValidity: DailyValidity;
    };
    stops: Stop[];
}