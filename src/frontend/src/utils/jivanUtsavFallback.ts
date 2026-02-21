import { PlanEntry, StructuredPlan, PlanMetadata } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

/**
 * Canonical display title for Jivan Utsav plan
 */
export const JIVAN_UTSAV_TITLE = 'Jivan Utsav';
export const JIVAN_UTSAV_ID = 'jivan-utsav';

/**
 * Fallback poster path for Jivan Utsav plan
 */
export const JIVAN_UTSAV_POSTER_PATH = '/assets/generated/jivan-utsav-poster.dim_1024x1156.jpg';

/**
 * Check if a plan title matches "Jivan Utsav" (case-insensitive, handles spelling variants)
 */
export function isJivanUtsavPlan(title: string): boolean {
  const normalized = title.toLowerCase().replace(/[^a-z]/g, '');
  return normalized.includes('jivanutsav') || 
         normalized.includes('jeevanutsav') ||
         normalized.includes('jivanutasav') ||
         normalized.includes('jeevanutasav');
}

/**
 * Fallback content for Jivan Utsav plan
 */
export function getJivanUtsavFallbackContent(): StructuredPlan {
  return {
    title: JIVAN_UTSAV_TITLE,
    analysis: `LIC's Jivan Utsav (Plan No. 771) is a 10-Year Limited Premium Payment Plan offering guaranteed annual income starting from year 13. This comprehensive plan combines life insurance protection with attractive guaranteed returns, making it an ideal choice for long-term financial planning and family security.`,
    goals: `Guaranteed Annual Income: ₹50,000 to ₹2,00,000 starting from year 13
Guaranteed Sum Assured: ₹5 lakh to ₹20 lakh
100% Guaranteed Returns with no market risk
Financial security for your family's future
Regular income stream after premium payment period`,
    hypothesis: `Comprehensive life insurance coverage throughout the policy term
Death benefit includes sum assured plus accrued bonuses
Natural and accidental risk coverage included
Financial protection for your family against unforeseen circumstances
Ensures family's financial stability in case of unfortunate events`,
    experiment: `Premium Information:
Monthly Premium Options: ₹5,000 to ₹20,400
Limited premium payment for only 10 years
Flexible payment frequencies: Monthly, Quarterly, Half-yearly, Yearly
Multiple sum assured options to suit your financial needs
Easy premium payment through various modes including online, auto-debit, and offline channels`,
    result: `Guaranteed annual income starting from year 13 until maturity
Lump sum maturity benefit at the end of policy term
Tax benefits under Section 80C and Section 10(10D) of Income Tax Act
24/7 customer service and support available
Loan facility available after policy acquires surrender value
Transparent terms with no hidden charges`,
  };
}

/**
 * Get fallback description for Jivan Utsav
 */
export function getJivanUtsavDescription(): string {
  return 'LIC Jivan Utsav - 10-Year Limited Premium Payment Plan with Guaranteed Annual Income starting from year 13. Offers 100% guaranteed returns with comprehensive life insurance coverage.';
}

/**
 * Get fallback metadata for Jivan Utsav
 */
export function getJivanUtsavFallbackMetadata(): PlanMetadata {
  return {
    title: JIVAN_UTSAV_TITLE,
    description: getJivanUtsavDescription(),
    creator: Principal.fromText('2vxsx-fae'), // Anonymous principal
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  };
}
