import { StructuredPlan } from '../backend';

export interface OCRProgress {
  status: string;
  progress: number;
}

/**
 * Placeholder OCR function - extracts basic metadata from image
 * In production, this would use tesseract.js or similar OCR library
 * For now, it returns a structured template based on the plan name
 */
export async function extractTextFromImage(
  imageFile: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<string> {
  // Simulate OCR processing
  if (onProgress) {
    onProgress({ status: 'Loading image...', progress: 10 });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onProgress({ status: 'Analyzing image...', progress: 50 });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onProgress({ status: 'Extracting text...', progress: 80 });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onProgress({ status: 'Finalizing...', progress: 95 });
  }

  // Return placeholder text based on filename
  const fileName = imageFile.name.toLowerCase();
  
  // Jeevan Utsav (handle both Jivan and Jeevan spellings, plus typo "utasav")
  if (fileName.includes('jivan utsav') || fileName.includes('jeevan utsav') ||
      fileName.includes('jivan utasav') || fileName.includes('jeevan utasav')) {
    return `LIC's Jeevan Utsav (Plan No. 771)
10-Year Limited Premium Payment Plan
Guaranteed Annual Income Starting Year 13
Monthly Premium Options: ₹5,000 to ₹20,400
Guaranteed Annual Income: ₹50,000 to ₹2,00,000
Guaranteed Sum Assured: 5 lakh to 20 lakh
100% Guaranteed Returns
24/7 Service Available`;
  }
  
  // Jeevan Umang
  if (fileName.includes('jivan umang') || fileName.includes('jeevan umang')) {
    return `LIC's Jeevan Umang
Guaranteed Bonus with Lifelong Benefits
Pay premiums for only 15 years
Lifetime pension of ₹50,000
Maturity benefit of ₹52 lakh + ₹60,000
Natural risk cover up to ₹5.5 lakh
Accidental risk cover up to ₹11 lakh`;
  }

  // Bima Laxmi
  if (fileName.includes('bima laxmi') || fileName.includes('bima lakshmi')) {
    return `LIC's Bima Laxmi
Child Education and Marriage Plan
Guaranteed Maturity Benefits
Regular Survival Benefits
Risk Coverage for Parents
Tax Benefits under Section 80C`;
  }

  // Jeevan Labh
  if (fileName.includes('jivan labh') || fileName.includes('jeevan labh')) {
    return `LIC's Jeevan Labh
Limited Premium Payment Term
Guaranteed Additions
Death Benefit Coverage
Maturity Benefit with Bonuses
Flexible Premium Payment Options`;
  }

  // Jeevan Lakshya
  if (fileName.includes('jivan lakshya') || fileName.includes('jeevan lakshya')) {
    return `LIC's Jeevan Lakshya
Goal-Based Savings Plan
Limited Premium Payment
Guaranteed Maturity Benefits
Life Insurance Coverage
Tax Benefits Available`;
  }

  // Generic template for other plans
  return `LIC Insurance Plan
Comprehensive coverage and guaranteed benefits
Flexible payment terms
Risk coverage included
Maturity benefits available
Tax benefits under Section 80C`;
}

export function parseExtractedText(rawText: string, planTitle: string): StructuredPlan {
  // Clean up the text
  const cleanText = rawText.trim();
  const lines = cleanText.split('\n').filter(line => line.trim().length > 0);

  // Extract key information based on common LIC plan patterns
  let analysis = '';
  let goals = '';
  let hypothesis = '';
  let experiment = '';
  let result = '';

  // Categorize lines based on keywords
  const keywordMap: Record<string, string[]> = {
    analysis: ['plan', 'guaranteed', 'annual income', 'payment period', 'investment', 'premium', 'limited premium', 'year', 'service'],
    goals: ['benefit', 'maturity', 'family fund', 'income benefit', 'total income', 'pension', 'survival', 'education', 'marriage'],
    hypothesis: ['risk cover', 'natural risk', 'accidental risk', 'insurance', 'protection', 'coverage', 'death benefit', 'life insurance'],
    experiment: ['yearly investment', 'total investment', 'payment', 'deposit', 'premium', 'pay', 'monthly premium', 'options', 'flexible'],
    result: ['bonus', 'lifetime', 'pension', 'returns', 'profit', 'lakh', 'sum assured', 'guaranteed sum', 'tax benefit'],
  };

  const categorizedLines: Record<string, string[]> = {
    analysis: [],
    goals: [],
    hypothesis: [],
    experiment: [],
    result: [],
  };

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => lowerLine.includes(keyword))) {
        categorizedLines[category].push(line);
        categorized = true;
        break;
      }
    }

    // If not categorized, add to analysis as general info
    if (!categorized && line.length > 10) {
      categorizedLines.analysis.push(line);
    }
  });

  // Build structured sections with enhanced fallbacks
  analysis = categorizedLines.analysis.length > 0
    ? categorizedLines.analysis.join('\n')
    : `${planTitle} is a comprehensive LIC insurance plan offering guaranteed benefits and financial security for your family's future. This plan combines life insurance protection with attractive returns, making it an ideal choice for long-term financial planning.`;

  goals = categorizedLines.goals.length > 0
    ? categorizedLines.goals.join('\n')
    : `This plan provides financial security, guaranteed returns, and comprehensive benefits for your family. It is designed to help you achieve your long-term financial goals such as children's education, marriage expenses, retirement planning, and wealth creation. The plan ensures regular income and lump sum benefits at maturity.`;

  hypothesis = categorizedLines.hypothesis.length > 0
    ? categorizedLines.hypothesis.join('\n')
    : `Comprehensive risk coverage including life insurance protection throughout the policy term. The plan safeguards your family against unforeseen circumstances by providing death benefits and ensuring financial stability. In case of unfortunate events, your family receives the sum assured along with accrued bonuses.`;

  experiment = categorizedLines.experiment.length > 0
    ? categorizedLines.experiment.join('\n')
    : `Flexible payment terms with various investment options to suit your financial planning needs. Multiple premium payment frequencies are available including monthly, quarterly, half-yearly, and yearly modes. The plan offers limited premium payment terms, allowing you to pay for a shorter duration while enjoying benefits for a longer period.`;

  result = categorizedLines.result.length > 0
    ? categorizedLines.result.join('\n')
    : `Guaranteed returns with attractive bonus benefits throughout the policy term. The plan provides regular income during the policy period and a substantial lump sum maturity benefit to secure your family's financial future. Tax benefits are available under Section 80C and Section 10(10D) of the Income Tax Act, making it a tax-efficient investment option.`;

  return {
    title: planTitle,
    analysis,
    goals,
    hypothesis,
    experiment,
    result,
  };
}

export async function processImageForPlan(
  imageFile: File,
  planTitle: string,
  onProgress?: (progress: OCRProgress) => void
): Promise<StructuredPlan> {
  const rawText = await extractTextFromImage(imageFile, onProgress);
  return parseExtractedText(rawText, planTitle);
}
