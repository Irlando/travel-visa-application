import { z } from 'zod';

const commonFields = {
  givenNames: z.string().min(2, 'Given names must be at least 2 characters'),
  lastNames: z.string().min(2, 'Last names must be at least 2 characters'),
  sex: z.enum(['M', 'F']),
  birthDate: z.string(),
  birthPlace: z.string().min(2, 'Birth place must be at least 2 characters'),
  residenceCountry: z.string().min(2, 'Residence country must be at least 2 characters'),
  nationality: z.string().min(2, 'Nationality must be at least 2 characters'),
  passportNumber: z.string().min(4, 'Passport number must be at least 4 characters'),
  passportValidity: z.string(),
  passportIssuer: z.string().min(2, 'Passport issuer must be at least 2 characters'),
  flightNumber: z.string().min(2, 'Flight number must be at least 2 characters'),
  arrivalDate: z.string(),
  departureDate: z.string(),
  arrivalCity: z.string().min(2, 'Arrival city must be at least 2 characters'),
  hasExistingVisa: z.boolean(),
  accommodationName: z.string().min(2, 'Accommodation name must be at least 2 characters'),
  accommodationAddress: z.string().min(5, 'Accommodation address must be at least 5 characters'),
  accommodationCity: z.string().min(2, 'Accommodation city must be at least 2 characters'),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
};

export const touristFormSchema = z.object({
  ...commonFields,
});

export const agencyFormSchema = z.object({
  ...commonFields,
  agencyName: z.string().min(2, 'Agency name must be at least 2 characters'),
  agencyContact: z.string().min(2, 'Contact person must be at least 2 characters'),
  agencyEmail: z.string().email('Invalid email address'),
  agencyPhone: z.string().min(6, 'Phone number must be at least 6 characters'),
  agencyAddress: z.string().min(5, 'Agency address must be at least 5 characters'),
});

export type TouristFormSchema = z.infer<typeof touristFormSchema>;
export type AgencyFormSchema = z.infer<typeof agencyFormSchema>;