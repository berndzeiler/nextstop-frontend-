export interface Schedule {
    startStopShortName: string; 
    endStopShortName: string;   
    routeName: string;          
    departureTime: string;     
    arrivalTime: string;        
    delayInMinutes: number;    
    isDirectConnection: boolean; 
}
  