import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitAgencyApplication } from '../lib/api';
import type { AgencyFormData } from '../types';

interface AgencyFormProps {
  language: 'en' | 'pt';
  onBack: () => void;
}

export default function AgencyForm({ language, onBack }: AgencyFormProps) {
  const [formData, setFormData] = useState<Partial<AgencyFormData>>({
    acceptedTerms: false,
    hasExistingVisa: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const result = await submitAgencyApplication(formData as AgencyFormData, language);
      
      if (result.success) {
        // Store reference for status checking
        localStorage.setItem('applicationReference', result.reference);
        
        // Redirect to payment
        window.location.href = result.paymentUrl;
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to submit application. Please try again.' 
          : 'Falha ao enviar pedido. Por favor, tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, passportCopy: e.target.files![0] }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        {language === 'en' ? 'Back to Services' : 'Voltar aos Serviços'}
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {language === 'en' ? 'Agency Application Form' : 'Formulário de Pedido Agência'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Agency Information' : 'Informações da Agência'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Agency Name' : 'Nome da Agência'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Contact Person' : 'Pessoa de Contato'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, agencyContact: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Email' : 'Email'}
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, agencyEmail: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Phone' : 'Telefone'}
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, agencyPhone: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Address' : 'Endereço'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, agencyAddress: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Traveler Information' : 'Informações do Viajante'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Given Names' : 'Nomes Próprios'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, givenNames: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Last Names' : 'Apelidos'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, lastNames: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Sex' : 'Sexo'}
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, sex: e.target.value as 'M' | 'F' }))}
                >
                  <option value="">
                    {language === 'en' ? 'Select gender' : 'Selecione o sexo'}
                  </option>
                  <option value="M">
                    {language === 'en' ? 'Male' : 'Masculino'}
                  </option>
                  <option value="F">
                    {language === 'en' ? 'Female' : 'Feminino'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Birth Date' : 'Data de Nascimento'}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Birth Place' : 'Local de Nascimento'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Residence Country' : 'País de Residência'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, residenceCountry: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Nationality' : 'Nacionalidade'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Passport Number' : 'Número do Passaporte'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Passport Validity' : 'Validade do Passaporte'}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, passportValidity: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Passport Issuer' : 'Emissor do Passaporte'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, passportIssuer: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Passport Copy' : 'Cópia do Passaporte'}
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Flight Number' : 'Número do Voo'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Arrival Date' : 'Data de Chegada'}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, arrivalDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Departure Date' : 'Data de Partida'}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Arrival City' : 'Cidade de Chegada'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, arrivalCity: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Accommodation Name' : 'Nome da Acomodação'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, accommodationName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Accommodation Address' : 'Endereço da Acomodação'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, accommodationAddress: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Accommodation City' : 'Cidade da Acomodação'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={e => setFormData(prev => ({ ...prev, accommodationCity: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={e => setFormData(prev => ({ ...prev, hasExistingVisa: e.target.checked }))}
                />
                <span className="text-sm text-gray-700">
                  {language === 'en' ? 'Traveler already has a visa' : 'Viajante já possui visto'}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  required
                  className="rounded border-gray-300"
                  onChange={e => setFormData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
                />
                <span className="text-sm text-gray-700">
                  {language === 'en' 
                    ? 'I agree to the terms and conditions' 
                    : 'Concordo com os termos e condições'}
                </span>
              </label>
              <p className="mt-2 text-sm text-gray-600">
                {language === 'en'
                  ? 'By submitting this form, you agree to our processing of personal data for visa application purposes. All data will be handled in accordance with our privacy policy and applicable data protection laws. As a travel agency, you confirm that you have obtained consent from the traveler to process their information.'
                  : 'Ao enviar este formulário, você concorda com o processamento de dados pessoais para fins de solicitação de visto. Todos os dados serão tratados de acordo com nossa política de privacidade e leis de proteção de dados aplicáveis. Como agência de viagens, você confirma que obteve consentimento do viajante para processar suas informações.'}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? (
                language === 'en' ? 'Submitting...' : 'Enviando...'
              ) : (
                language === 'en' ? 'Submit Application' : 'Enviar Pedido'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}