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
├── src/                                    # Source code directory
│   ├── components/                         # All React components
│   │   ├── Index/                         # Page-level components (full pages)
│   │   │   ├── AdvancedBusinessWebsite.jsx    # Homepage with hero, features, CTA sections
│   │   │   ├── ServicesPage.jsx               # Services overview with cards and descriptions
│   │   │   ├── ServiceDetailPage.jsx          # Dynamic service detail page (slug-based routing)
│   │   │   ├── QuantumAboutPage.jsx           # About us page with team and company info
│   │   │   ├── QuantumContactPage.jsx         # Contact page with form and UTM tracking
│   │   │   ├── CaseStudiesPage.jsx            # Case studies listing page
│   │   │   ├── CaseStudyPage.jsx              # Individual case study detail page
│   │   │   ├── BlogPage.jsx                   # Blog listing page with post previews
│   │   │   ├── BlogDetailPage.jsx             # Individual blog post page
│   │   │   ├── PricingPage.jsx                # Pricing page with ROI calculator
│   │   │   ├── Navigation.jsx                 # Main navigation bar with mobile menu
│   │   │   ├── Navbar.jsx                     # Alternative/legacy navbar component
│   │   │   ├── Footer.jsx                     # Footer with newsletter, links, social media
│   │   │   ├── HeroIllustration.jsx           # Hero section animated graphics
│   │   │   ├── ServicesShowcase.jsx           # Services grid/showcase component
│   │   │   ├── PartnersCarousel.jsx           # Embla-based partners logo carousel
│   │   │   ├── TeamGrid.jsx                   # Team member grid with photos and bios
│   │   │   ├── ServiceLayout.jsx              # Layout wrapper for service pages
│   │   │   ├── HiddenUtmFields.jsx            # Hidden form fields for UTM tracking
│   │   │   └── services/                      # Individual service detail pages
│   │   │       ├── AgenticAutomationPage.jsx      # Agentic AI automation service page
│   │   │       ├── DocumentIntelligencePage.jsx   # Document processing service page
│   │   │       ├── SqlDashboardsPage.jsx          # SQL analytics service page
│   │   │       ├── MlopsCicdPage.jsx              # MLOps CI/CD service page
│   │   │       └── ServiceCard.jsx                # Reusable service card component
│   │   │
│   │   ├── AlgorythmosCalculator.jsx      # Interactive ROI calculator with inputs/outputs
│   │   ├── ContactForm.jsx                # Reusable contact form with EmailJS integration
│   │   ├── GlobalCtaTracker.jsx           # Analytics tracker for CTA button clicks
│   │   └── RoiCoverageChart.jsx           # Recharts visualization for ROI sensitivity
│   │
│   ├── data/                              # Static data and content
│   │   ├── services.js                        # Service definitions, descriptions, FAQs
│   │   └── team.js                            # Team member data (names, roles, photos)
│   │
│   ├── lib/                               # Utility functions and helpers
│   │   ├── analytics.js                       # Analytics tracking wrapper (GA/Amplitude stub)
│   │   ├── utm.js                             # UTM parameter persistence and retrieval
│   │   ├── roiMath.js                         # ROI calculation logic and formatters
│   │   └── roiMath.spec.js                    # Unit tests for ROI calculations
│   │
│   ├── assets/                            # Images, logos, and static media
│   │   ├── partners/                          # Partner company logos
│   │   └── team/                              # Team member photos
│   │       └── README.md                      # Documentation for team photos
│   │
│   ├── App.jsx                            # Main app component with React Router setup
│   ├── App.css                            # Global app styles
│   ├── main.jsx                           # Application entry point (renders App)
│   └── index.css                          # Global CSS and Tailwind imports
│
├── public/                                # Static files served directly (no processing)
│   ├── Algorythmos.png                        # Main logo and favicon image
│   ├── favicon.ico                            # Browser favicon
│   ├── vite.svg                               # Vite logo
│   ├── manifest.json                          # PWA manifest for mobile installation
│   ├── sitemap.xml                            # SEO sitemap for search engines
│   ├── robots.txt                             # Search engine crawler instructions
│   ├── google-site-verification.html          # Google Search Console verification
│   ├── bing-verification.html                 # Bing Webmaster Tools verification
│   └── yandex-verification.html               # Yandex Webmaster verification
│
├── e2e/                                   # End-to-end tests (Playwright)
│   ├── acronym-expansions.spec.ts             # Tests acronym first-mention expansions
│   └── mlops-pause.spec.ts                    # Tests MLOps pipeline animation controls
│
├── tests/                                 # Unit and integration tests (Vitest)
│   └── pricing-utm.spec.ts                    # Tests UTM tracking on pricing page
│
├── scripts/                               # Build and validation scripts
│   ├── seo-validate.js                        # SEO metadata validation script
│   └── acronyms.config.json                   # Configuration for acronym testing
│
├── tailwind.config.js                     # Tailwind CSS configuration (colors, plugins)
├── postcss.config.js                      # PostCSS configuration for Tailwind
├── vite.config.js                         # Vite build tool configuration
├── eslint.config.js                       # ESLint linting rules
├── playwright.config.ts                   # Playwright E2E test configuration
├── vercel.json                            # Vercel deployment and routing config
├── package.json                           # Project dependencies and scripts
├── package-lock.json                      # Locked dependency versions
├── index.html                             # HTML entry point with SEO meta tags
└── README.md                              # Project documentation (this file)
```

### Key Directory Explanations

#### `src/components/Index/`
Contains all **full-page components** that correspond to routes in the application. Each file represents a complete page view with its own layout, content, and functionality. These are the main destinations users navigate to.

#### `src/components/`
Houses **reusable UI components** that can be used across multiple pages. These include forms, calculators, charts, and tracking components that provide specific functionality without being full pages.

#### `src/data/`
Stores **static content and configuration** in JavaScript files. This separation allows easy content updates without touching component code. Service descriptions, team profiles, and other structured data live here.

#### `src/lib/`
Contains **pure utility functions** with no React dependencies. These helpers handle business logic like ROI calculations, UTM parameter management, and analytics tracking. Keeping them separate makes testing easier.

#### `public/`
Files here are **served directly to the browser** without any build processing. Perfect for SEO files (sitemap, robots.txt), verification files for search engines, and static assets that don't need optimization.

#### `e2e/` and `tests/`
Two types of tests: **end-to-end tests** (`e2e/`) simulate real user interactions in a browser, while **unit tests** (`tests/`) verify individual functions and components work correctly in isolation.

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
