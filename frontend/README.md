# Dokumentation WEA5-Projekt Bernd Zeiler

## Inhaltsverzeichnis

TODO

## Architektur

### Komponentenbaum-Diagramm

![component-diagramm](Komponentenbaumdiagramm.png)

### Wichtige Komponenten

#### TripPlannerComponent

Die Startseite der Applikation. Hier kann man Fahrplanabfragen durchführen. Die Komponente beinhaltet die Auswahl der Start- und Zielhaltestelle, Datum und Uhrzeit, Abfahrts- oder Ankunftszeit und die gewünschte Anzahl an Verbindungen. <br>
Für die Auswahl der Start- bzw. Zielhaltestelle kann man entweder über die `StopSearchComponent` mit Namen oder über die `GpsSearchComponent` mit dem aktuellen Standort suchen. <br>
Die gefundenen Verbindungen werden mit Berücksichtigung von möglichen Verspätungen(Check-Ins) in einer Tabelle angezeigt.

#### DeparturesComponent

Hier werden die nächsten Abfahrten für eine bestimmte Haltestelle angezeigt. Die Komponente beinhaltet eine Haltestelle, Datum und Uhrzeit und die gewünschte Anzahl an Verbindungen. <br>
Für die Auswahl der Haltestelle kann der User wieder entscheiden ob er nach Namen oder GPS-Koordinaten der Haltestelle suchen will. <br>
Die nächsten Abfahrten werden wieder mit Berücksichtigung von Verspätungen in einer Tabelle angezeigt.

#### DelayStatisticsComponent

Hier kann man sich eine Verspätungsstatistik über die Pünktlichkeit aller Verkehrsmittel ausgeben lassen. Die Komponente beinhaltet den gewünschten Zeitraum(Start- und Enddatum) und eine optionale Routennummer, falls die Statistikauswertung spezifisch für eine Route ausgegeben werden soll. <br>
Die Ausgabe der durchschnittlichen Verspätungen wird in Form eines Balkendiagramms (mithilfe der Libraries `chart.js` und `ng2-charts`) angezeigt.

#### LoginComponent

Hier kann man sich als Administrator anmelden. Über diese Komponente wird man auf die `Keycloak`-Anmeldemaske weitergeleitet, wo sich der Admin mit seinen Zugangsdaten einloggen kann. Bei erfolgreicher Anmeldung wird man auf die eigentliche Webseite zurückgeleitet und die `AdminComponent` wird über den `CanNavigateToAdminGuard` damit freigeschalten.

#### AdminComponent

Hier kann man Feiertage/Schulferien, Haltestellen und Routen verwalten. Über diese Komponente gelangt man zu den jeweiligen 3 Komponenten.

#### HolidaysComponent

Hier kann man Feiertage bzw. Schulferien verwalten. Die vorhandenen Feiertage (inkl. Kennzeichnung von Schulferien) werden in einer Tabelle angezeigt. Man kann dort einen neuen Feiertag anlegen als auch einen vorhandenen bearbeiten, indem man auf die `HolidayFormComponent` weitergeleitet wird. Das Löschen eines vorhandenen Feiertags ist ebenfalls möglich.

#### StopsComponent

Hier kann man Haltestellen verwalten. Die vorhandenen Haltestellen werden in einer Tabelle angezeigt. Man kann dort eine neue Haltestelle anlegen als auch eine vorhandene bearbeiten, indem man auf die `StopFormComponent` weitergeleitet wird. Das Löschen einer vorhandenen Haltestelle ist ebenfalls möglich. 

#### RoutesComponent

Hier kann man Verbindungen (Routen und deren Haltestellen) verwalten. Die vorhandenen Verbindungen werden in einer Tabelle angezeigt. Man kann dort eine neue Route inkl. aller Haltestellen-Informationen mit einem einzigen Request anlegen, indem man auf die `RouteFormComponent` weitergeleitet wird. Ebenso kann man sich die Details von vorhandenen Routen anzeigen lassen, indem man auf die `RouteDetailsComponent` weitergeleitet wird. Das Bearbeiten und Löschen ist hier nicht möglich, weil es lt. Aufgabenstellung nicht gefordert war.

#### StopSearchComponent

Diese Komponente ist ein Suchfeld, wo Haltestellen anhand ihres Namens gesucht werden können. Diese Komponente ist Teil innerhalb der `TripPlannerComponent`, `DeparturesComponent` und `RouteFormComponent`.

#### SelectedStopDisplayComponent

Diese Komponente zeigt z.B. in der Abfahrten-Seite die letzendlich ausgewählte Haltestelle des Users an, welche von der `StopSearchComponent` oder `GpsSearchComponent` gefunden wurde.

#### GpsModalComponent

Diese Komponente öffnet z.b. in der Abfahrten-Seite ein Dialogfenster, wo dann die `GpsSearchComponent` angezeigt wird.

#### GpsSearchComponent

In dieser Komponente kann man sich anhanden des aktuellen Standorts die nächstgelegenen Haltestellen anzeigen lassen.

### Zusammenhang Services mit Komponenten

#### TripPlannerService

Die `TripPlannerComponent` erhält hier die gefundenen Verbindungen für die mitgegebene Start- und Zielhaltestelle und weiteren Parmetern.

#### DepartureService

Die `DeparturesComponent` erhält hier die gefundenen nächsten Verbindungen ausgehend von der mitgegebenen Haltestelle, wo man wegfahren will.

#### DelayStatisticsService

Die `DelayStatisticsComponent` erhält hier die Verspätungsstatistikdaten ausgehend von dem eingegebenen Zeitraum und optionaler Routennummer.

#### AuthenticationService

Dieses Service wird von der `LoginComponent` verwendet, um den Login-Prozess über Keycloak zu initialisieren und den Authentifizierungsstatus des Benutzers zu prüfen. <br> Sie wird außerdem von der `AppComponent` genutzt, um den Login-Status abzufragen und auch um den Benutzer wieder auszuloggen.

#### HolidaysService

Dieses Service wird von der `HolidaysComponent` und `HolidayFormComponent` verwendet, um die notwendigen Create-Read-Update-Delete(CRUD)-Abfragen ausführen zu können.

#### StopsService

Dieses Service wird von der `StopsComponent` und `StopFormComponent` verwendet, um die notwendigen Create-Read-Update-Delete(CRUD)-Abfragen ausführen zu können. <br>
Auch die `RouteDetailsComponent` verwendet das Service, um die Haltestellen für eine bestimmte Route detailliert ausgeben zu können. <br>
Ebenfalls benötigen die `StopSearchComponent` und `GpsSearchComponent` das Service, um die Haltestellen anhand eines Suchbegriffes(Name oder GPS-Position der Haltestelle) abfragen zu können.

#### RoutesService

Dieses Service wird von der `RoutesComponent`, der `RouteFormComponent` und der `RouteDetailsComponent` verwendet, um Get- und Create-Anweisungen durchführen zu können. <br>
Außerdem benötigt dieses Service auch die `DelayStatisticsComponent`, damit sich der User aus allen vorhandenen Routen die Verspätungsstatistik anzeigen lassen kann.

### Models

Models wurden erstellt, um die Datenstruktur der Anwendung typsicher zu definieren. Sie erleichtern die Interaktion zwischen Services und Komponenten sowie die Verarbeitung von Backend-Daten, wie z. B. Haltestellen, Verbindungen und Benutzerinformationen.

### Helpers

#### ChartConfig

Definiert die Konfiguration und die Datenstruktur für die Darstellung der Verspätungsstatistik in einem Balkendiagramm mithilfe von `chart.js`.

#### Validators (Directives)

Direktiven wie z.B. die `DateRangeValidatorDirective` validieren Benutzereingaben, z. B. ob das Enddatum nach dem Startdatum liegt, und stellen so sicher, dass die Eingabedaten korrekt sind. Ich habe für das Projekt ein großes Augenmerk auf Input-Validation gelegt.

#### ErrorMessages

Bündelt alle spezifischen Fehlermeldungen für Formulare wie `HolidayForm`, `StopForm`, und `RouteForm`, um konsistente und benutzerfreundliche Validierungsnachrichten anzuzeigen.