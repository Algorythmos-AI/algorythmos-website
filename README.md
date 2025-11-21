# Algorythmos

<!-- Deployment trigger: Ensuring latest stable version is deployed -->

A professional website for **Algorythmos**, a boutique AI consultancy delivering agentic automation, document intelligence, SQL analytics, and MLOps engineering for SMEs across Europe and Australia.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with React Router
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom brand colors
- **Animations**: Framer Motion
- **Charts**: Recharts for ROI visualization
- **SEO**: React Helmet Async for meta tags
- **Testing**: Playwright (E2E), Vitest (unit tests)
- **Deployment**: Vercel with SPA routing
- **Icons**: Lucide React

## 📋 Features

### Core Functionality
- **Multi-page SPA**: Home, Services, About, Contact, Case Studies, Blog, and Pricing pages
- **Service Pages**: Dedicated pages for 4 core services (Agentic Automation, Document Intelligence, SQL Dashboards, MLOps CI/CD)
- **ROI Calculator**: Interactive calculator with coverage sensitivity analysis and dynamic charts
- **UTM Tracking**: Comprehensive UTM parameter persistence across sessions with last-CTA attribution
- **Newsletter Subscription**: Mailchimp integration in footer
- **Contact Forms**: EmailJS-powered contact forms with hidden UTM fields
- **SEO Optimization**: Comprehensive meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **PWA Ready**: Progressive Web App manifest with brand assets

### Components
- Responsive navigation with mobile menu
- Partners carousel with Embla Carousel
- Team grid with dynamic member profiles
- Service cards with routing
- Global CTA tracker for analytics
- Hidden UTM fields for form attribution

### Developer Features
- ESLint configuration with React plugins
- TypeScript support for test files
- E2E tests for critical user flows
- SEO validation script
- Acronym expansion testing
- Custom brand color palette (`algviolet`, `algpurple`, `algblue`)

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/skalaliya/Algorythmos.git
cd Algorythmos

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Mailchimp Newsletter Configuration
REACT_APP_MAILCHIMP_API_KEY=your_mailchimp_api_key_here
REACT_APP_MAILCHIMP_LIST_ID=your_audience_list_id_here
REACT_APP_MAILCHIMP_SERVER_PREFIX=us1

# EmailJS Contact Form (if needed)
# REACT_APP_EMAILJS_SERVICE_ID=your_service_id
# REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
# REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

**Mailchimp Setup:**
1. **API Key**: Account → Extras → API Keys → Create A Key
2. **List ID**: Audience → Settings → Audience name and defaults → Copy Audience ID
3. **Server Prefix**: The part after the dash in your API key (e.g., "us1", "us2")

## 💻 Development

```bash
# Start development server (http://localhost:5173)
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run all Playwright E2E tests
npm run test:e2e

# Run specific E2E test suite
npm run test:e2e:acronyms

# Run unit tests (Vitest)
npm test

# Validate SEO metadata
npm run seo:check
```

### Test Coverage
- **UTM Tracking**: Validates UTM persistence and CTA attribution (`tests/pricing-utm.spec.ts`)
- **Acronym Expansions**: Ensures proper acronym expansions on key pages (`e2e/acronym-expansions.spec.ts`)
- **MLOps Pipeline**: Tests interactive pipeline animation controls (`e2e/mlops-pause.spec.ts`)
- **ROI Math**: Unit tests for calculator logic (`src/lib/roiMath.spec.js`)

## 📦 Deployment

### Vercel (Recommended)

```bash
# Deploy to production
npm run deploy:prod
```

The project is configured with `vercel.json` for SPA routing and includes:
- Automatic deployment on push to main branch
- Environment variable management via Vercel dashboard
- Custom domain configuration for `www.algorythmos.fr`

### Manual Build

```bash
npm run build
# Deploy the 'dist' folder to any static hosting service
```

## 📁 Project Structure

```
/
├── src/
│   ├── components/           # React components
│   │   ├── Index/           # Page-level components
│   │   │   ├── services/    # Service detail pages
│   │   │   └── ...
│   │   ├── AlgorythmosCalculator.jsx
│   │   ├── ContactForm.jsx
│   │   ├── GlobalCtaTracker.jsx
│   │   └── RoiCoverageChart.jsx
│   ├── data/                # Static data (services, team)
│   ├── lib/                 # Utilities (analytics, UTM, ROI math)
│   ├── assets/              # Images and static assets
│   ├── App.jsx              # Main app with routes
│   └── main.jsx             # Entry point
├── public/                  # Static files, SEO files
├── e2e/                     # E2E tests (Playwright)
├── tests/                   # Unit tests (Vitest)
├── scripts/                 # Build/validation scripts
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
├── playwright.config.ts     # Playwright test configuration
└── vercel.json              # Vercel deployment config
```

## 🎨 Branding

The project uses custom brand colors defined in `tailwind.config.js`:
- **algviolet**: `#6D00FF` (primary brand color)
- **algpurple**: `#7658E7` (accent)
- **algblue**: `#3715E0` (secondary)

Custom shadow: `shadow-brand` for brand-consistent elevation effects.

## 🔍 SEO & Analytics

### SEO Features
- Canonical URLs for all pages
- Open Graph metadata for social sharing
- Twitter Card support
- JSON-LD structured data
- Multi-region targeting (France & Australia)
- Sitemap and robots.txt
- Search engine verification files

### Analytics
- UTM parameter tracking with sessionStorage persistence
- Last-click CTA attribution
- Global CTA tracker for conversion analytics
- Placeholder for GA/Amplitude/Mixpanel integration in `src/lib/analytics.js`

## 📄 Key Routes

- `/` - Homepage with hero, services showcase, team
- `/services` - Services overview
- `/services/agentic-automation` - Agentic AI service
- `/services/document-intelligence` - Document processing service
- `/services/sql-dashboards` - SQL analytics service
- `/services/mlops-cicd` - MLOps engineering service
- `/about` - About page with company info
- `/contact` - Contact form
- `/pricing` - Pricing calculator and plans
- `/case-studies` - Case studies overview
- `/case-studies/:slug` - Individual case study
- `/blog` - Blog listing
- `/blog/:slug` - Blog post detail

## 🤝 Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Run tests: `npm run test:e2e` and `npm test`
4. Validate SEO: `npm run seo:check`
5. Submit a pull request

## 📝 License

Private repository. All rights reserved by Algorythmos.

## 🔗 Links

- **Website**: [www.algorythmos.fr](https://www.algorythmos.fr)
- **Twitter**: [@algorythmos](https://x.com/algorythmos)

---

Built with ❤️ by the Algorythmos team
