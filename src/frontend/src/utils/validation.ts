export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone || phone.trim().length === 0) {
    return null; // Phone is optional
  }
  
  // Remove spaces, dashes, and plus signs for validation
  const cleanPhone = phone.replace(/[\s\-+]/g, '');
  
  // Check if it contains only digits and is between 10-15 characters
  if (!/^\d{10,15}$/.test(cleanPhone)) {
    return 'Please enter a valid phone number (10-15 digits)';
  }
  
  return null;
}
