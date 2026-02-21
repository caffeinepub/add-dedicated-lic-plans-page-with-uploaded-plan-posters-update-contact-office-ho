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
  selectPlansToCompare: TranslatedText;
  compareNow: TranslatedText;
  clearSelection: TranslatedText;
  minimumTwoPlans: TranslatedText;
  comparisonTable: TranslatedText;
  planName: TranslatedText;
  premiumDetails: TranslatedText;
  maturityBenefits: TranslatedText;
  sumAssured: TranslatedText;
  guaranteedAdditions: TranslatedText;
  bonuses: TranslatedText;
  premiumCalculator: TranslatedText;
  enterYourAge: TranslatedText;
  desiredSumAssured: TranslatedText;
  calculatePremiums: TranslatedText;
  monthlyPremium: TranslatedText;
  quarterlyPremium: TranslatedText;
  halfYearlyPremium: TranslatedText;
  annualPremium: TranslatedText;
  calculatedResults: TranslatedText;
  eligiblePlans: TranslatedText;
  notEligible: TranslatedText;
  ageValidation: TranslatedText;
  sumAssuredValidation: TranslatedText;
  maturityCalculator: TranslatedText;
  premiumAmount: TranslatedText;
  totalMaturityAmount: TranslatedText;
  maturityBreakdown: TranslatedText;
  calculateMaturity: TranslatedText;
  eligibleForMaturity: TranslatedText;
  baseSum: TranslatedText;
  additionalBenefits: TranslatedText;
  projectedMaturity: TranslatedText;
  premiumValidation: TranslatedText;
  termValidation: TranslatedText;
  roiAnalysis: TranslatedText;
  returnOnInvestment: TranslatedText;
  effectiveAnnualReturn: TranslatedText;
  totalPremiumsPaid: TranslatedText;
  maturityBenefitsReceived: TranslatedText;
  netGain: TranslatedText;
  roiPercentage: TranslatedText;
  compareReturns: TranslatedText;
  bestReturns: TranslatedText;
  roiComparison: TranslatedText;
  investmentPeriod: TranslatedText;
  filterPlans: TranslatedText;
  ageRange: TranslatedText;
  minAge: TranslatedText;
  maxAge: TranslatedText;
  premiumBudget: TranslatedText;
  monthlyBudget: TranslatedText;
  financialGoals: TranslatedText;
  savingsGoal: TranslatedText;
  pensionGoal: TranslatedText;
  moneyBackGoal: TranslatedText;
  guaranteedReturnsGoal: TranslatedText;
  clearFilters: TranslatedText;
  applyFilters: TranslatedText;
  noPlansMatch: TranslatedText;
}
