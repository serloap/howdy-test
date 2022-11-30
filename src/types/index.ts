export type Place = {
  code: string,
  name: string,
  cityCode: string,
}

type Layover = {
  duration: number,
  location: Place,
}

export type Layovers = {
  all: Array<Layover>,
  short: Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
}

type SegmentJourneyCommon = {
  arrivalDateTime: string,
  departureDateTime: string,
  originPlace: Place,
  destinationPlace: Place,
  duration: number,
}

export type Segment = SegmentJourneyCommon & {
  arrivalDateTimeWithTimeZone?: string,
  departureDateTimeWithTimeZone?: string,
  fareBasis: string,
  fareCategory: string,
  fareClasses?: string,
  fareFamily?: string,
  marketingAirline: string,
  marketingFlightnumber?: string | number,
  operatingAirline: string,
  operatingFlightnumber?: string,
}

export type Journey = SegmentJourneyCommon & {
  cabinClass: string,
  layovers: Layovers,
  segments: Segment[],
}

export type Trip = {
  segments: Segment[],
}

export type FlightOption = {
  duration: number,
  itineraryPrice: number,
  journeys: Journey[],
  virtualInterlining?: boolean,
  id?: number,
}

export type Airports = { [code: string]: Place };

export type Carriers = { [id: string]: string };

export type ExampleApiResponse = {
  options: FlightOption[],
  carriers: Carriers,
};
