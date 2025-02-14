import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { getApplicationStatus } from '../lib/api';

interface PaymentResultProps {
  language: 'en' | 'pt';
}

export default function PaymentResult({ language }: PaymentResultProps) {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const reference = localStorage.getItem('applicationReference');

  useEffect(() => {
    const checkStatus = async () => {
      if (!reference) {
        setStatus('error');
        return;
      }

      try {
        const applicationStatus = await getApplicationStatus(reference);
        setStatus(applicationStatus.payment_status === 'paid' ? 'success' : 'error');
      } catch (error) {
        console.error('Status check error:', error);
        setStatus('error');
      }
    };

    checkStatus();
  }, [reference]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' ? (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Processing Payment' : 'Processando Pagamento'}
            </h2>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Please wait while we confirm your payment...'
                : 'Aguarde enquanto confirmamos seu pagamento...'}
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Payment Successful!' : 'Pagamento Bem-sucedido!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === 'en'
                ? 'Your application has been received and is being processed.'
                : 'Seu pedido foi recebido e está sendo processado.'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {language === 'en'
                ? 'Reference number:'
                : 'Número de referência:'} <strong>{reference}</strong>
            </p>
            <a
              href={`/status?reference=${reference}`}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {language === 'en' ? 'Track Application' : 'Acompanhar Pedido'}
            </a>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Payment Failed' : 'Falha no Pagamento'}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === 'en'
                ? 'There was an issue processing your payment. Please try again.'
                : 'Houve um problema ao processar seu pagamento. Por favor, tente novamente.'}
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {language === 'en' ? 'Return to Home' : 'Voltar ao Início'}
            </a>
          </>
        )}
      </div>
    </div>
  );
}