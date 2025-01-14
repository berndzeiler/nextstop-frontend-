export interface Route {
    routeNumber: number;
    validFrom: string; // Format: yyyy-MM-dd
    validUntil: string; // Format: yyyy-MM-dd
    dailyValidity: DailyValidity;
}

// Enumeration for Daily validity
export enum DailyValidity {
    Weekdays = 'Weekdays',
    Weekends = 'Weekends',
    Holidays = 'Holidays',
    SchoolHolidays = 'SchoolHolidays',
    AllDays = 'AllDays',
}
export const DailyValidityTranslations: { [key in DailyValidity]: string } = {
    [DailyValidity.Weekdays]: 'Werktage',
    [DailyValidity.Weekends]: 'Wochenende',
    [DailyValidity.Holidays]: 'Feiertage',
    [DailyValidity.SchoolHolidays]: 'Schulferien',
    [DailyValidity.AllDays]: 'Alle Tage',
};