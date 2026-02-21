/**
 * Utilities for matching uploaded plan images to plan titles
 * and selecting the best candidate when multiple files map to the same plan
 */

export interface FileWithDerivedTitle {
  file: File;
  derivedTitle: string;
  normalizedName: string;
}

/**
 * Normalize a filename for matching (lowercase, remove extensions, collapse whitespace)
 */
export function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}

/**
 * Normalize a plan title for comparison (handles spelling variants)
 */
export function normalizePlanTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/jivan/g, 'jeevan') // Normalize Jivan -> Jeevan
    .replace(/laxmi/g, 'lakshmi') // Normalize Laxmi -> Lakshmi
    .replace(/utasav/g, 'utsav') // Fix common typo
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Derive a plan title from a filename using explicit mappings and fallback capitalization
 * Enhanced to handle common spelling variants (Jivan/Jeevan, Utasav/Utsav) and various separators
 */
export function derivePlanTitle(filename: string): string {
  const normalized = normalizeFilename(filename);
  
  // Remove common prefixes like "lic" to focus on the plan name
  const withoutPrefix = normalized.replace(/^lic\s+/, '');

  // Explicit mappings for known plan names with spelling variants
  // Jivan Utsav / Jeevan Utsav (including typo "utasav")
  if (
    withoutPrefix.includes('jivan utsav') || 
    withoutPrefix.includes('jeevan utsav') || 
    withoutPrefix.includes('jivan utasav') || 
    withoutPrefix.includes('jeevan utasav') ||
    normalized.includes('jivan utsav') || 
    normalized.includes('jeevan utsav') ||
    normalized.includes('jivan utasav') || 
    normalized.includes('jeevan utasav')
  ) {
    return 'Jeevan Utsav';
  }
  
  // Jivan Umang / Jeevan Umang
  if (
    withoutPrefix.includes('jivan umang') || 
    withoutPrefix.includes('jeevan umang') ||
    normalized.includes('jivan umang') || 
    normalized.includes('jeevan umang')
  ) {
    return 'Jeevan Umang';
  }
  
  // Bima Laxmi / Bima Lakshmi
  if (normalized.includes('bima laxmi') || normalized.includes('bima lakshmi')) {
    return 'Bima Laxmi';
  }
  
  // Jivan Labh / Jeevan Labh
  if (
    withoutPrefix.includes('jivan labh') || 
    withoutPrefix.includes('jeevan labh') ||
    normalized.includes('jivan labh') || 
    normalized.includes('jeevan labh')
  ) {
    return 'Jeevan Labh';
  }
  
  // Jivan Lakshya / Jeevan Lakshya
  if (
    withoutPrefix.includes('jivan lakshya') || 
    withoutPrefix.includes('jeevan lakshya') ||
    normalized.includes('jivan lakshya') || 
    normalized.includes('jeevan lakshya')
  ) {
    return 'Jeevan Lakshya';
  }

  // Fallback: capitalize each word, removing common words like "plan"
  return filename
    .replace(/\.[^/.]+$/, '')
    .split(/[-_\s]+/)
    .filter(word => word.length > 0 && word.toLowerCase() !== 'plan')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Score a filename for how well it matches a plan title
 * Higher score = better match
 */
function scoreFilenameForPlan(filename: string, planTitle: string): number {
  const normalized = normalizeFilename(filename);
  const normalizedTitle = normalizePlanTitle(planTitle);
  
  let score = 0;

  // Bonus for containing "LIC" (official branding)
  if (normalized.includes('lic')) {
    score += 100;
  }

  // Bonus for exact plan name match (using normalized comparison)
  if (normalizePlanTitle(normalized).includes(normalizedTitle)) {
    score += 50;
  }

  // Extract numeric suffix (e.g., "file-2.jpg" -> 2)
  const numericMatch = filename.match(/-(\d+)\./);
  if (numericMatch) {
    score += parseInt(numericMatch[1], 10);
  }

  // Prefer files without numeric suffix (base name)
  if (!filename.match(/-\d+\./)) {
    score += 1000;
  }

  return score;
}

/**
 * Group files by their derived plan title
 */
export function groupFilesByPlanTitle(files: File[]): Map<string, FileWithDerivedTitle[]> {
  const groups = new Map<string, FileWithDerivedTitle[]>();

  for (const file of files) {
    const derivedTitle = derivePlanTitle(file.name);
    const normalizedName = normalizeFilename(file.name);
    
    const entry: FileWithDerivedTitle = {
      file,
      derivedTitle,
      normalizedName,
    };

    if (!groups.has(derivedTitle)) {
      groups.set(derivedTitle, []);
    }
    groups.get(derivedTitle)!.push(entry);
  }

  return groups;
}

/**
 * Select the best file candidate for a plan title from a group of files
 * Uses deterministic scoring: prefers LIC branding, exact name match, higher numeric suffix
 */
export function selectBestCandidate(files: FileWithDerivedTitle[], planTitle: string): FileWithDerivedTitle {
  if (files.length === 0) {
    throw new Error(`No files provided for plan: ${planTitle}`);
  }

  if (files.length === 1) {
    return files[0];
  }

  // Score each file and sort by score (descending)
  const scored = files.map(entry => ({
    entry,
    score: scoreFilenameForPlan(entry.file.name, planTitle),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored[0].entry;
}

/**
 * Build a mapping of plan title -> best file from a list of uploaded files
 */
export function buildBestCandidateMapping(files: File[]): Map<string, File> {
  const groups = groupFilesByPlanTitle(files);
  const mapping = new Map<string, File>();

  for (const [planTitle, fileEntries] of groups.entries()) {
    const best = selectBestCandidate(fileEntries, planTitle);
    mapping.set(planTitle, best.file);
  }

  return mapping;
}
