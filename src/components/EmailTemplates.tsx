import React from 'react';

interface EmailTemplateProps {
  reference: string;
  name: string;
  amount: number;
  type: 'tourist' | 'agency';
  language: 'en' | 'pt';
}

export const ConfirmationEmailTemplate: React.FC<EmailTemplateProps> = ({
  reference,
  name,
  amount,
  type,
  language
}) => {
  const isEnglish = language === 'en';
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#002B7F', padding: '20px', textAlign: 'center' }}>
        <img 
          src="https://example.com/logo.png" 
          alt="Cabo Verde Visa" 
          style={{ height: '50px' }} 
        />
      </div>
      
      <div style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}>
        <h1 style={{ color: '#002B7F', marginBottom: '20px' }}>
          {isEnglish ? 'Application Confirmation' : 'Confirmação de Pedido'}
        </h1>
        
        <p style={{ marginBottom: '20px', color: '#666666' }}>
          {isEnglish 
            ? `Dear ${name},` 
            : `Prezado(a) ${name},`}
        </p>
        
        <p style={{ marginBottom: '20px', color: '#666666' }}>
          {isEnglish
            ? `Your ${type === 'tourist' ? 'EASE assistance' : 'visa assistance'} application has been received successfully.`
            : `Seu pedido de ${type === 'tourist' ? 'assistência EASE' : 'assistência de visto'} foi recebido com sucesso.`}
        </p>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ marginBottom: '10px', color: '#333333' }}>
            <strong>{isEnglish ? 'Reference Number:' : 'Número de Referência:'}</strong> {reference}
          </p>
          <p style={{ marginBottom: '10px', color: '#333333' }}>
            <strong>{isEnglish ? 'Amount:' : 'Valor:'}</strong> €{amount.toFixed(2)}
          </p>
          <p style={{ color: '#333333' }}>
            <strong>{isEnglish ? 'Status:' : 'Estado:'}</strong> {isEnglish ? 'Pending Payment' : 'Aguardando Pagamento'}
          </p>
        </div>
        
        <p style={{ marginBottom: '20px', color: '#666666' }}>
          {isEnglish
            ? 'Please complete the payment to proceed with your application. Once the payment is confirmed, we will process your request within 48 business hours.'
            : 'Por favor, complete o pagamento para prosseguir com seu pedido. Após a confirmação do pagamento, processaremos sua solicitação em 48 horas úteis.'}
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href={`https://example.com/status/${reference}`}
            style={{
              backgroundColor: '#002B7F',
              color: '#ffffff',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            {isEnglish ? 'Check Application Status' : 'Verificar Estado do Pedido'}
          </a>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666666', fontSize: '14px' }}>
          {isEnglish
            ? 'If you have any questions, please contact our support team.'
            : 'Se tiver alguma dúvida, entre em contato com nossa equipe de suporte.'}
        </p>
        <p style={{ color: '#666666', fontSize: '14px', marginTop: '10px' }}>
          support@caboverdevisa.gov.cv | +238 123 456 789
        </p>
      </div>
    </div>
  );
};