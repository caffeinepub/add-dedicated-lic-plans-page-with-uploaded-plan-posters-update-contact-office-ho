import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubmitEnquiry } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { validateEmail, validatePhone, validateRequired } from '@/utils/validation';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    productInterest: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitEnquiry = useSubmitEnquiry();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameError = validateRequired(formData.name, 'Name');
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    const messageError = validateRequired(formData.message, 'Message');
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await submitEnquiry.mutateAsync({
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email,
        city: formData.city || null,
        productInterest: formData.productInterest || null,
        message: formData.message
      });

      toast.success('Thank you! Your enquiry has been submitted successfully. I will contact you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        productInterest: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again or contact us directly.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+91 98765 43210"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Your city"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productInterest">Product Interest</Label>
        <Select value={formData.productInterest} onValueChange={(value) => handleChange('productInterest', value)}>
          <SelectTrigger id="productInterest">
            <SelectValue placeholder="Select a product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="term">Term Insurance</SelectItem>
            <SelectItem value="endowment">Endowment Plans</SelectItem>
            <SelectItem value="ulip">ULIP Plans</SelectItem>
            <SelectItem value="pension">Pension Plans</SelectItem>
            <SelectItem value="child">Child Education Plans</SelectItem>
            <SelectItem value="other">Other / Not Sure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Tell me about your insurance needs and any questions you have..."
          rows={5}
          className={errors.message ? 'border-destructive' : ''}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        disabled={submitEnquiry.isPending}
      >
        {submitEnquiry.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Enquiry'
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to be contacted regarding your enquiry.
      </p>
    </form>
  );
}
