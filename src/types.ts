export interface TouristFormData {
  givenNames: string;
  lastNames: string;
  sex: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  residenceCountry: string;
  nationality: string;
  passportNumber: string;
  passportValidity: string;
  passportIssuer: string;
  flightNumber: string;
  arrivalDate: string;
  departureDate: string;
  arrivalCity: string;
  hasExistingVisa: boolean;
  accommodationName: string;
  accommodationAddress: string;
  accommodationCity: string;
  passportCopy: File | null;
  acceptedTerms: boolean;
}

export interface AgencyFormData extends TouristFormData {
  agencyName: string;
  agencyContact: string;
  agencyEmail: string;
  agencyPhone: string;
  agencyAddress: string;
}

export interface ServiceType {
  id: string;
  name: string;
  namePort: string;
  price: number;
  description: string;
  descriptionPort: string;
}