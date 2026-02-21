export type Language = 'mr' | 'hi' | 'en';

export interface TranslatedText {
  mr: string;
  hi: string;
  en: string;
}

export interface PlanTranslation {
  name: TranslatedText;
  description: TranslatedText;
  benefits: TranslatedText[];
  premiumDetails: TranslatedText;
  maturityDetails: TranslatedText;
  additionalInfo: TranslatedText;
}

export interface PlanTranslations {
  [planId: string]: PlanTranslation;
}

export interface UILabels {
  sectionTitle: TranslatedText;
  viewDetailsButton: TranslatedText;
  collapseButton: TranslatedText;
  languageToggle: {
    mr: string;
    hi: string;
    en: string;
  };
  planNumber: TranslatedText;
  coverage: TranslatedText;
  premium: TranslatedText;
  policyTerm: TranslatedText;
  keyBenefits: TranslatedText;
  fullDetails: TranslatedText;
  eligibility: TranslatedText;
  contactUs: TranslatedText;
}
