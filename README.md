# Cape Verde Visa Application System

A modern web application for managing visa and EASE (Electronic Authorization System for Entry) applications for Cape Verde. The system supports both individual tourists and travel agencies, offering a bilingual interface (English and Portuguese).

## Features

- 🌐 Bilingual Support (English/Portuguese)
- 🔒 Secure Application Processing
- 💳 SISP Payment Integration
- 📧 Automated Email Notifications
- 📱 Responsive Design
- 🏢 Travel Agency Portal
- 🔍 Application Status Tracking
- 📄 Document Upload System

## Services

1. **EASE Assistance**
   - Electronic pre-registration for entry into Cape Verde
   - Price: €35.80

2. **Tourist Visa Assistance**
   - Tourist visa application assistance
   - Price: €62.00

## Technology Stack

### Frontend
- React: ^18.3.1
- TypeScript: ^5.5.3
- Vite: ^5.4.2
- Tailwind CSS: ^3.4.1
- Lucide React (Icons): ^0.344.0
- React Hot Toast: ^2.4.1
- Zod (Validation): ^3.22.4

### Backend
- Supabase: ^2.39.7
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Storage for Documents
  - Authentication

### Development Tools
- ESLint: ^9.9.1
- PostCSS: ^8.4.35
- Autoprefixer: ^10.4.18

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── AgencyForm.tsx
│   │   ├── EmailTemplates.tsx
│   │   ├── ServiceSelection.tsx
│   │   └── TouristForm.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── email.ts
│   │   ├── payment.ts
│   │   ├── supabase.ts
│   │   └── validation.ts
│   └── App.tsx
├── supabase/
│   └── migrations/
└── public/
```

## Database Schema

### Tables
- `applications`: Base table for all applications
- `tourist_applications`: Tourist-specific data
- `agency_applications`: Agency-specific data
- `application_documents`: Document storage references

## Processing Time
- 48 business hours after payment confirmation

## Payment Methods
- International Cards
- Bank Transfer
- SISP Payment Gateway
  - 2.5% International Payment Fee
  - 4 Business Days Transit Time

## Security Features

- Row Level Security (RLS) on all database tables
- Secure file upload system
- Form validation and sanitization
- HTTPS enforcement
- Protected API endpoints

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/your-repo/cape-verde-visa
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Deployment

The application can be deployed to any static hosting service that supports single-page applications.

## API Integration Points

1. SISP Payment Gateway
2. Email Service
3. Document Storage
4. Application Processing System

## Support

For technical support, contact:
- Email: support@caboverdevisa.gov.cv
- Phone: +238 123 456 789
## Regras para Fazer Commit

Para garantir a integridade do projeto, siga estas regras ao fazer commits:

1. **main**: A branch `main` está protegida. Todos os commits devem ser feitos através de pull requests.
2. **Revisão de Código**: Todos os pull requests devem ser revisados e aprovados por pelo menos um colaborador antes de serem mesclados.
3. **Testes Automatizados**: Certifique-se de que todos os testes automatizados passem antes de abrir um pull request.
4. **Mensagens de Commit**: Use mensagens de commit claras e descritivas. Siga o padrão: `Tipo: Descrição breve do commit`.
5. **Commits Pequenos e Frequentes**: Faça commits pequenos e frequentes para facilitar a revisão de código e a identificação de problemas.

Seguindo essas recomendações, garantimos a qualidade e a estabilidade do código.

## License

Proprietary - All rights reserved

---

Made with ❤️ for Cape Verde Immigration Services
