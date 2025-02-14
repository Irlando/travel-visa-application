import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getApplicationStatus } from '../lib/api';

interface StatusTrackingProps {
  language: 'en' | 'pt';
}

interface ApplicationStatus {
  status: string;
  payment_status: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
}

export default function StatusTracking({ language }: StatusTrackingProps) {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reference = searchParams.get('reference') || localStorage.getItem('applicationReference');

  useEffect(() => {
    const fetchStatus = async () => {
      if (!reference) {
        setError(
          language === 'en'
            ? 'No reference number provided'
            : 'Número de referência não fornecido'
        );
        setLoading(false);
        return;
      }

      try {
        const data = await getApplicationStatus(reference);
        setStatus(data);
      } catch (err) {
        setError(
          language === 'en'
            ? 'Failed to fetch application status'
            : 'Falha ao buscar status do pedido'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [reference, language]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-8 w-8 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-600" />;
      case 'processing':
        return <Clock className="h-8 w-8 text-yellow-600" />;
      default:
        return <Clock className="h-8 w-8 text-blue-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { en: string; pt: string }> = {
      pending_payment: {
        en: 'Pending Payment',
        pt: 'Aguardando Pagamento'
      },
      payment_received: {
        en: 'Payment Received',
        pt: 'Pagamento Recebido'
      },
      processing: {
        en: 'Processing',
        pt: 'Em Processamento'
      },
      approved: {
        en: 'Approved',
        pt: 'Aprovado'
      },
      rejected: {
        en: 'Rejected',
        pt: 'Rejeitado'
      }
    };

    return statusMap[status]?.[language] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'en' ? 'Loading...' : 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'Return to Home' : 'Voltar ao Início'}
          </a>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'en'
              ? 'Application not found'
              : 'Pedido não encontrado'}
          </h2>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'Return to Home' : 'Voltar ao Início'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {language === 'en' ? 'Application Status' : 'Status do Pedido'}
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Reference Number' : 'Número de Referência'}
              </p>
              <p className="font-medium">{status.reference_number}</p>
            </div>
            {getStatusIcon(status.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'en' ? 'Status' : 'Status'}
              </p>
              <p className="font-medium">{getStatusText(status.status)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'en' ? 'Payment Status' : 'Status do Pagamento'}
              </p>
              <p className="font-medium">{getStatusText(status.payment_status)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'en' ? 'Submission Date' : 'Data de Envio'}
              </p>
              <p className="font-medium">
                {new Date(status.created_at).toLocaleDateString(
                  language === 'en' ? 'en-US' : 'pt-BR'
                )}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'en' ? 'Last Updated' : 'Última Atualização'}
              </p>
              <p className="font-medium">
                {new Date(status.updated_at).toLocaleDateString(
                  language === 'en' ? 'en-US' : 'pt-BR'
                )}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {language === 'en' ? 'Return to Home' : 'Voltar ao Início'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}