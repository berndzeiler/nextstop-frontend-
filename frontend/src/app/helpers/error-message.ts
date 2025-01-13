export class ErrorMessage {
    constructor(
        public forControl: string,
        public forValidator: string,
        public text: string
    ) { }
}

export const HolidayFormErrorMessages = [
    new ErrorMessage('name', 'required', 'Bezeichnung darf nicht leer sein.')
];

export const StopFormErrorMessages = [
    new ErrorMessage('name', 'required', 'Bezeichnung darf nicht leer sein.'),
    new ErrorMessage('shortName', 'required', 'Kurzbezeichnung darf nicht leer sein.'),
    new ErrorMessage('shortName', 'shortNameNotUnique', 'Die Kurzbezeichnung für diese Haltestelle ist bereits vergeben.'),
    new ErrorMessage('shortName', 'pattern', 'Kurzbezeichnung darf nur Buchstaben und Zahlen enthalten.'),
    new ErrorMessage('latitude', 'required', 'Breitengrad ist erforderlich.'),
    new ErrorMessage('latitude', 'pattern', 'Breitengrad muss eine gültige Dezimalzahl von -90.0 bis 90.0 (mit maximal 14 Nachkommastellen) sein.'),
    new ErrorMessage('longitude', 'required', 'Längengrad ist erforderlich.'),
    new ErrorMessage('longitude', 'pattern', 'Längengrad muss eine gültige Dezimalzahl von -180.0 bis 180.0 (mit maximal 14 Nachkommastellen) sein.'),
];

export const RouteFormErrorMessages = [
    new ErrorMessage('validFrom', 'required', 'Das Startdatum ist erforderlich.'),
    new ErrorMessage('validUntil', 'required', 'Das Enddatum ist erforderlich.'),
    new ErrorMessage('dailyValidity', 'required', 'Die Tagesgültigkeit ist erforderlich.'),
    new ErrorMessage('stops', 'duplicateStop', 'This stop has already been added to the route.'),
  ];
