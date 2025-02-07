import React from 'react';
import { FileText, Building2 } from 'lucide-react';

interface ServiceSelectionProps {
  language: 'en' | 'pt';
  onSelectForm: (type: 'tourist' | 'agency') => void;
}

const services = [
  {
    id: 'ease',
    name: 'EASE Assistance',
    namePort: 'Assistência EASE',
    price: 35.80,
    description: 'Electronic pre-registration for entry into Cape Verde',
    descriptionPort: 'Pré-registro eletrônico para entrada em Cabo Verde'
  },
  {
    id: 'visa',
    name: 'Tourist Visa Assistance',
    namePort: 'Assistência Visto Turístico',
    price: 62.00,
    description: 'Tourist visa application assistance for Cape Verde',
    descriptionPort: 'Assistência na solicitação de visto turístico para Cabo Verde'
  }
];

export default function ServiceSelection({ language, onSelectForm }: ServiceSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-8 shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold text-[#002B7F] mb-3">
              {language === 'en' ? service.name : service.namePort}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' ? service.description : service.descriptionPort}
            </p>
            <p className="text-3xl font-bold text-[#002B7F]">
              €{service.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => onSelectForm('tourist')}
          className="bg-white rounded-xl p-8 text-center hover:shadow-2xl transition-shadow"
        >
          <div className="flex flex-col items-center">
            <FileText className="h-16 w-16 text-[#002B7F] mb-4" />
            <h3 className="text-2xl font-semibold text-[#002B7F] mb-3">
              {language === 'en' ? 'Pre-registration of Travelers' : 'Pré-registo de Viajantes'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'For individual travelers and tourists' 
                : 'Para viajantes e turistas individuais'}
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelectForm('agency')}
          className="bg-white rounded-xl p-8 text-center hover:shadow-2xl transition-shadow"
        >
          <div className="flex flex-col items-center">
            <Building2 className="h-16 w-16 text-[#002B7F] mb-4" />
            <h3 className="text-2xl font-semibold text-[#002B7F] mb-3">
              {language === 'en' ? 'Travel Agencies' : 'Agências de Viagens'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'For travel agencies and tour operators' 
                : 'Para agências de viagens e operadores turísticos'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}