import { supabase } from './supabase';
import { TouristFormSchema, AgencyFormSchema } from './validation';
import { calculateFees } from './payment';
import toast from 'react-hot-toast';

export async function submitTouristApplication(data: TouristFormSchema, language: 'en' | 'pt') {
  try {
    // Calculate fees
    const fees = calculateFees(35.80); // EASE assistance fee

    // Start application submission
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert({
        type: 'tourist',
        email: data.email,
        given_names: data.givenNames,
        last_names: data.lastNames,
        sex: data.sex,
        birth_date: data.birthDate,
        birth_place: data.birthPlace,
        residence_country: data.residenceCountry,
        nationality: data.nationality,
        passport_number: data.passportNumber,
        passport_validity: data.passportValidity,
        passport_issuer: data.passportIssuer,
        flight_number: data.flightNumber,
        arrival_date: data.arrivalDate,
        departure_date: data.departureDate,
        arrival_city: data.arrivalCity,
        has_existing_visa: data.hasExistingVisa,
        accommodation_name: data.accommodationName,
        accommodation_address: data.accommodationAddress,
        accommodation_city: data.accommodationCity,
        payment_amount: fees.total
      })
      .select()
      .single();

    if (applicationError) throw applicationError;

    // Upload passport copy
    if (data.passportCopy) {
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(
          `${application.id}/passport.${data.passportCopy.name.split('.').pop()}`,
          data.passportCopy
        );

      if (uploadError) throw uploadError;
    }

    // For development, simulate payment URL
    const paymentUrl = `/payment/result?reference=${application.reference_number}`;

    // Store reference for status checking
    localStorage.setItem('applicationReference', application.reference_number);

    return { 
      success: true, 
      paymentUrl, 
      reference: application.reference_number 
    };
  } catch (error) {
    console.error('Application submission failed:', error);
    
    // Show user-friendly error message
    const errorMessage = language === 'en'
      ? 'Failed to submit application. Please try again.'
      : 'Falha ao enviar pedido. Por favor, tente novamente.';
    
    toast.error(errorMessage);
    
    throw error;
  }
}

export async function submitAgencyApplication(data: AgencyFormSchema, language: 'en' | 'pt') {
  try {
    // Calculate fees
    const fees = calculateFees(62.00); // Visa assistance fee

    // Start application submission
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert({
        type: 'agency',
        email: data.agencyEmail,
        given_names: data.givenNames,
        last_names: data.lastNames,
        sex: data.sex,
        birth_date: data.birthDate,
        birth_place: data.birthPlace,
        residence_country: data.residenceCountry,
        nationality: data.nationality,
        passport_number: data.passportNumber,
        passport_validity: data.passportValidity,
        passport_issuer: data.passportIssuer,
        flight_number: data.flightNumber,
        arrival_date: data.arrivalDate,
        departure_date: data.departureDate,
        arrival_city: data.arrivalCity,
        has_existing_visa: data.hasExistingVisa,
        accommodation_name: data.accommodationName,
        accommodation_address: data.accommodationAddress,
        accommodation_city: data.accommodationCity,
        payment_amount: fees.total
      })
      .select()
      .single();

    if (applicationError) throw applicationError;

    // Create agency application record
    const { error: agencyError } = await supabase
      .from('agency_applications')
      .insert({
        id: application.id,
        agency_name: data.agencyName,
        agency_contact: data.agencyContact,
        agency_email: data.agencyEmail,
        agency_phone: data.agencyPhone,
        agency_address: data.agencyAddress
      });

    if (agencyError) throw agencyError;

    // Upload passport copy
    if (data.passportCopy) {
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(
          `${application.id}/passport.${data.passportCopy.name.split('.').pop()}`,
          data.passportCopy
        );

      if (uploadError) throw uploadError;
    }

    // For development, simulate payment URL
    const paymentUrl = `/payment/result?reference=${application.reference_number}`;

    // Store reference for status checking
    localStorage.setItem('applicationReference', application.reference_number);

    return { 
      success: true, 
      paymentUrl, 
      reference: application.reference_number 
    };
  } catch (error) {
    console.error('Application submission failed:', error);
    
    // Show user-friendly error message
    const errorMessage = language === 'en'
      ? 'Failed to submit application. Please try again.'
      : 'Falha ao enviar pedido. Por favor, tente novamente.';
    
    toast.error(errorMessage);
    
    throw error;
  }
}

export async function getApplicationStatus(reference: string) {
  try {
    // Set the reference number in the current session
    await supabase.rpc('set_reference_number', { ref: reference });

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        tourist_applications (*),
        agency_applications (*)
      `)
      .eq('reference_number', reference)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch application status:', error);
    throw error;
  }
}