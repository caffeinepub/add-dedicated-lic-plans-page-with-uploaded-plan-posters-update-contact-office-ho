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
  
  if (fileName.includes('jivan utsav') || fileName.includes('jeevan utsav')) {
    return `LIC's Jeevan Utsav
Guaranteed Regular Annual Income Plan
Payment Period: 5 years
Guaranteed Annual Income with 500% guarantee
Multiple investment options available
Family fund benefits included`;
  }
  
  if (fileName.includes('jivan umang') || fileName.includes('jeevan umang')) {
    return `LIC's Jeevan Umang
Guaranteed Bonus with Lifelong Benefits
Pay premiums for only 15 years
Lifetime pension of ₹50,000
Maturity benefit of ₹52 lakh + ₹60,000
Natural risk cover up to ₹5.5 lakh
Accidental risk cover up to ₹11 lakh`;
  }

  // Generic template for other plans
  return `LIC Insurance Plan
Comprehensive coverage and guaranteed benefits
Flexible payment terms
Risk coverage included
Maturity benefits available`;
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
    analysis: ['guaranteed', 'annual income', 'payment period', 'investment', 'premium', 'plan'],
    goals: ['benefit', 'maturity', 'family fund', 'income benefit', 'total income', 'pension'],
    hypothesis: ['risk cover', 'natural risk', 'accidental risk', 'insurance', 'protection', 'coverage'],
    experiment: ['yearly investment', 'total investment', 'payment', 'deposit', 'premium', 'pay'],
    result: ['bonus', 'lifetime', 'pension', 'returns', 'profit', 'lakh'],
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

  // Build structured sections with fallbacks
  analysis = categorizedLines.analysis.length > 0
    ? categorizedLines.analysis.join('\n')
    : `${planTitle} is a comprehensive LIC insurance plan offering guaranteed benefits and financial security for your family's future.`;

  goals = categorizedLines.goals.length > 0
    ? categorizedLines.goals.join('\n')
    : 'Provides financial security, guaranteed returns, and comprehensive benefits for your family. Designed to help you achieve your long-term financial goals.';

  hypothesis = categorizedLines.hypothesis.length > 0
    ? categorizedLines.hypothesis.join('\n')
    : 'Comprehensive risk coverage including life insurance protection. Safeguards your family against unforeseen circumstances.';

  experiment = categorizedLines.experiment.length > 0
    ? categorizedLines.experiment.join('\n')
    : 'Flexible payment terms with various investment options to suit your financial planning needs. Multiple premium payment frequencies available.';

  result = categorizedLines.result.length > 0
    ? categorizedLines.result.join('\n')
    : 'Guaranteed returns with attractive bonus benefits. Provides regular income and lump sum maturity benefits to secure your family\'s financial future.';

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
