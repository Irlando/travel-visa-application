import React, { useState } from 'react';
import { Globe2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import TouristForm from './components/TouristForm';
import AgencyForm from './components/AgencyForm';
import ServiceSelection from './components/ServiceSelection';

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'pt'>('pt');
  const [formType, setFormType] = useState<'tourist' | 'agency' | null>(null);

  return (
    <div className="min-h-screen bg-[#002B7F]">
      <Toaster position="top-center" />
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60&q=80" 
                alt="Cabo Verde Flag"
                className="h-8 w-8 object-cover rounded-full"
              />
              <span className="text-xl font-bold text-[#002B7F]">
                {currentLanguage === 'en' ? 'Cape Verde Visa' : 'Cabo Verde Visa'}
              </span>
            </div>
            <button
              onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'pt' : 'en')}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#002B7F] text-white hover:bg-[#001B4F] transition-colors"
            >
              <Globe2 className="h-5 w-5" />
              <span>{currentLanguage === 'en' ? 'PT' : 'EN'}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!formType ? (
          <div className="text-center">
            <div className="bg-white rounded-3xl p-12 mb-12">
              <h1 className="text-5xl font-bold text-[#002B7F] mb-4">
                {currentLanguage === 'en' ? 'WELCOME to' : 'BENVIDO a'}
              </h1>
              <h2 className="text-4xl font-bold text-[#002B7F] mb-8">
                {currentLanguage === 'en' ? 'Cape Verde Visa' : 'Cabo Verde Visa'}
              </h2>
              <div className="flex justify-center space-x-8">
                <img 
                  src="https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80" 
                  alt="Government Logo"
                  className="h-24 object-contain"
                />
                <img 
                  src="https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80" 
                  alt="Police Logo"
                  className="h-24 object-contain"
                />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-12">
              {currentLanguage === 'en' 
                ? 'EFFICIENT, AUTOMATIC AND SECURE TRAVELER ENTRY PROCESS' 
                : 'PROCESSO EFICIENTE, AUTOMÁTICO E SEGURO DE ENTRADA DE VIAJANTES'}
            </h3>
            <ServiceSelection 
              language={currentLanguage}
              onSelectForm={setFormType}
            />
          </div>
        ) : (
          formType === 'tourist' ? (
            <TouristForm language={currentLanguage} onBack={() => setFormType(null)} />
          ) : (
            <AgencyForm language={currentLanguage} onBack={() => setFormType(null)} />
          )
        )}
      </main>

      <footer className="bg-[#001B4F] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {currentLanguage === 'en' ? 'Contact Us' : 'Contacte-nos'}
              </h3>
              <p>Email: support@caboverdevisa.gov.cv</p>
              <p>Tel: +238 123 456 789</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {currentLanguage === 'en' ? 'Processing Time' : 'Tempo de Processamento'}
              </h3>
              <p>
                {currentLanguage === 'en' 
                  ? '48 business hours after payment confirmation' 
                  : '48 horas úteis após confirmação do pagamento'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {currentLanguage === 'en' ? 'Payment Methods' : 'Métodos de Pagamento'}
              </h3>
              <p>
                {currentLanguage === 'en' 
                  ? 'International Cards & Bank Transfer' 
                  : 'Cartões Internacionais & Transferência Bancária'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;