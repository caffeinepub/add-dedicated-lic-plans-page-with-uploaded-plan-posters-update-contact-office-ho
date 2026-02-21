import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../hooks/useLanguage';

interface ROIInputFormProps {
  onCalculate: (inputs: { premiumAmount: number; term: number; age: number }) => void;
}

export function ROIInputForm({ onCalculate }: ROIInputFormProps) {
  const { t } = useLanguage();
  const [premiumAmount, setPremiumAmount] = useState('50000');
  const [term, setTerm] = useState('20');
  const [age, setAge] = useState('30');
  const [errors, setErrors] = useState<{ premiumAmount?: string; age?: string }>({});

  const validate = () => {
    const newErrors: { premiumAmount?: string; age?: string } = {};
    const premiumNum = parseInt(premiumAmount);
    const ageNum = parseInt(age);

    if (isNaN(premiumNum) || premiumNum < 10000) {
      newErrors.premiumAmount = t({
        mr: 'प्रीमियम रक्कम किमान ₹10,000 असावी',
        hi: 'प्रीमियम राशि कम से कम ₹10,000 होनी चाहिए',
        en: 'Premium amount must be at least ₹10,000',
      });
    }

    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      newErrors.age = t({
        mr: 'वय 18 ते 65 दरम्यान असावे',
        hi: 'आयु 18 से 65 के बीच होनी चाहिए',
        en: 'Age must be between 18 and 65',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCalculate({
        premiumAmount: parseInt(premiumAmount),
        term: parseInt(term),
        age: parseInt(age),
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {t({ mr: 'तुमची माहिती प्रविष्ट करा', hi: 'अपनी जानकारी दर्ज करें', en: 'Enter Your Details' })}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="premiumAmount">
              {t({ mr: 'वार्षिक प्रीमियम रक्कम', hi: 'वार्षिक प्रीमियम राशि', en: 'Annual Premium Amount' })}
            </Label>
            <Input
              id="premiumAmount"
              type="number"
              min="10000"
              step="5000"
              value={premiumAmount}
              onChange={(e) => setPremiumAmount(e.target.value)}
              placeholder="50000"
            />
            {errors.premiumAmount && (
              <p className="text-sm text-destructive">{errors.premiumAmount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="term">
              {t({ mr: 'पॉलिसी मुदत', hi: 'पॉलिसी अवधि', en: 'Policy Term' })}
            </Label>
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 {t({ mr: 'वर्षे', hi: 'वर्ष', en: 'years' })}</SelectItem>
                <SelectItem value="15">15 {t({ mr: 'वर्षे', hi: 'वर्ष', en: 'years' })}</SelectItem>
                <SelectItem value="20">20 {t({ mr: 'वर्षे', hi: 'वर्ष', en: 'years' })}</SelectItem>
                <SelectItem value="25">25 {t({ mr: 'वर्षे', hi: 'वर्ष', en: 'years' })}</SelectItem>
                <SelectItem value="30">30 {t({ mr: 'वर्षे', hi: 'वर्ष', en: 'years' })}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">
              {t({ mr: 'प्रवेश वय', hi: 'प्रवेश आयु', en: 'Entry Age' })}
            </Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="65"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age}</p>
            )}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full md:w-auto">
          {t({ mr: 'ROI विश्लेषण करा', hi: 'ROI विश्लेषण करें', en: 'Analyze ROI' })}
        </Button>
      </form>
    </Card>
  );
}
