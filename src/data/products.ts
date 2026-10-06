/**
 * Single source of truth for product facts (apps Algorythmos publishes).
 *
 * Structure and identifiers only: every sentence a visitor reads lives in the
 * dictionaries under `pdfAlgoPro.*`. The App Store record and the app itself link
 * to these pages, so the paths below are a contract: change a path and the
 * links inside shipped builds break. `e2e/pdf-algo-pro.spec.ts` pins them.
 */
import { BUSINESS } from '@/data/business';

/** A published version of a legal document; `key` names its entry under `<ns>.changes.*`. */
export interface LegalVersion {
  version: string;
  /** Effective date, YYYY-MM-DD. */
  date: string;
  key: string;
}

/** A link shown under a legal section; `href` is site-relative (localised on the page) or absolute. */
export interface LegalLink {
  labelKey: string;
  href: string;
}

export interface LegalDocumentSpec {
  /** Dictionary namespace, e.g. `pdfAlgoPro.privacy`. */
  ns: string;
  /** Section ids in reading order; each is also the anchor on the page. */
  sections: readonly string[];
  /** Newest first. The first entry is the current version. */
  versions: readonly LegalVersion[];
  links: Readonly<Record<string, readonly LegalLink[]>>;
}

const APPLE_EULA = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const APPLE_PRIVACY = 'https://www.apple.com/legal/privacy/';

export const PDF_ALGO_PRO = {
  name: 'PDF Algo Pro',
  /** Region-relative paths (localise with `localizePath`). */
  paths: {
    product: '/pdf-algo-pro',
    privacy: '/pdf-algo-pro/privacy',
    terms: '/pdf-algo-pro/terms',
    support: '/pdf-algo-pro/support',
  },
  /** Support and privacy requests for the app. */
  supportEmail: 'pdfalgopro@algorythmos.com',
  /** Security reports go to the company address, as the app's security policy says. */
  securityEmail: BUSINESS.email,
  securitySubject: 'SECURITY: pdf-algo-pro',
  /** Minimum iOS and iPadOS major version the app runs on. */
  minimumOS: '26',
  /**
   * `testflight` until the app is on the App Store. Switching to `live` (with the
   * numeric `appStoreId`) turns the status line into the App Store link.
   */
  storeStatus: 'testflight' as 'testflight' | 'live',
  appStoreId: '',
  icon: { src: '/pdf-algo-pro/icon-512.webp', size: 512 },
  /** Outcome cards on the product page, in the order positioning requires. */
  features: ['answers', 'scan', 'sign', 'organise'],
  privacyPoints: 3,
  requirements: 3,
  supportChecklist: 3,
  faqs: ['files', 'backup', 'intelligence', 'appLock', 'delete', 'purchases', 'testflight', 'security'],
  privacy: {
    ns: 'pdfAlgoPro.privacy',
    sections: [
      'scope',
      'who',
      'summary',
      'onDevice',
      'permissions',
      'intelligence',
      'receive',
      'apple',
      'thirdParties',
      'overseas',
      'retention',
      'children',
      'rights',
      'security',
      'complaints',
      'changes',
      'contact',
    ],
    versions: [{ version: '1.0', date: '2026-10-06', key: 'v1_0' }],
    links: {
      scope: [{ labelKey: 'pdfAlgoPro.privacy.links.site', href: '/privacy' }],
      apple: [{ labelKey: 'pdfAlgoPro.privacy.links.apple', href: APPLE_PRIVACY }],
    },
  } satisfies LegalDocumentSpec,
  terms: {
    ns: 'pdfAlgoPro.terms',
    sections: [
      'agreement',
      'licence',
      'use',
      'documents',
      'intelligence',
      'signatures',
      'testBuilds',
      'purchases',
      'support',
      'ownership',
      'liability',
      'law',
      'changes',
      'contact',
    ],
    versions: [{ version: '1.0', date: '2026-10-06', key: 'v1_0' }],
    links: {
      licence: [{ labelKey: 'pdfAlgoPro.terms.links.eula', href: APPLE_EULA }],
      documents: [{ labelKey: 'pdfAlgoPro.nav.privacy', href: '/pdf-algo-pro/privacy' }],
      support: [{ labelKey: 'pdfAlgoPro.nav.support', href: '/pdf-algo-pro/support' }],
    },
  } satisfies LegalDocumentSpec,
} as const;
