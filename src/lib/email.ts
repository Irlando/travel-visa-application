interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export async function sendEmail(emailData: EmailData) {
  // This is a placeholder for the actual email sending implementation
  // You would need to integrate with your chosen email service provider
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}

export function generateConfirmationEmail(data: Record<string, any>, language: 'en' | 'pt') {
  const subject = language === 'en' 
    ? 'Cape Verde Visa Application Confirmation'
    : 'Confirmação de Pedido de Visto Cabo Verde';

  const template = language === 'en' ? 'confirmation-en' : 'confirmation-pt';

  return {
    subject,
    template,
    data,
  };
}