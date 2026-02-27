export interface LocalizedText {
  bn: string;
  en: string;
}

export interface Stop {
  name: LocalizedText;
  distance: number;
}

export interface Route {
  code: LocalizedText;
  name: LocalizedText;
  stops: Stop[];
}

export interface BusData {
  routes: Route[];
}
