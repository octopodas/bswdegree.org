export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export interface CounterConfig {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export interface ProsConsItem {
  title: string;
  desc: string;
}

export interface ProsConsData {
  pros: ProsConsItem[];
  cons: ProsConsItem[];
}

export interface SalaryDataItem {
  label: string;
  value: number;
  color?: string;
}

export interface SalaryData {
  [key: string]: SalaryDataItem[];
}

export interface LicensureRequirement {
  state: string;
  bsw_license: string;
  msw_license: string;
  supervision_hours: string;
  exam_required: string;
  continuing_education: string;
  license_renewal: string;
}

export interface DegreeComparison {
  name: string;
  focus: string;
  career_preparation: string;
  graduate_school: string;
  licensure: string;
  salary_range: string;
  job_outlook: string;
}

export interface DegreeComparisonData {
  [key: string]: DegreeComparison;
}

export interface StructuredDataWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface StructuredDataEducationalOrganization {
  "@context": "https://schema.org";
  "@type": "EducationalOrganization";
  name: string;
  description: string;
  url: string;
  sameAs: string[];
  hasOfferCatalog: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: Array<{
      "@type": "Course";
      name: string;
      description: string;
      provider: {
        "@type": "Organization";
        name: string;
      };
      educationalCredentialAwarded: string;
    }>;
  };
}