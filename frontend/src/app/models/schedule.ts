export interface Schedule {
    startStopShortName: string; 
    endStopShortName: string;   
    routeName: string;          
    departureTime: string;     
    arrivalTime: string;        
    delayInMinutesStartStop: number;    
    delayInMinutesEndStop: number; 
    isDirectConnection: boolean; 
}
  