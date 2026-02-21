import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../hooks/useLanguage';

interface PremiumCalculatorFormProps {
  onCalculate: (inputs: { age: number; sumAssured: number; term: number }) => void;
}

export function PremiumCalculatorForm({ onCalculate }: PremiumCalculatorFormProps) {
  const { t } = useLanguage();
  const [age, setAge] = useState('30');
  const [sumAssured, setSumAssured] = useState('500000');
  const [term, setTerm] = useState('20');
  const [errors, setErrors] = useState<{ age?: string; sumAssured?: string }>({});

  const validate = () => {
    const newErrors: { age?: string; sumAssured?: string } = {};
    const ageNum = parseInt(age);
    const sumAssuredNum = parseInt(sumAssured);

    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      newErrors.age = t({
        mr: 'वय 18 ते 65 दरम्यान असावे',
        hi: 'आयु 18 से 65 के बीच होनी चाहिए',
        en: 'Age must be between 18 and 65',
      });
    }

    if (isNaN(sumAssuredNum) || sumAssuredNum < 100000) {
      newErrors.sumAssured = t({
        mr: 'विमा रक्कम किमान ₹1,00,000 असावी',
        hi: 'बीमा राशि कम से कम ₹1,00,000 होनी चाहिए',
        en: 'Sum assured must be at least ₹1,00,000',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCalculate({
        age: parseInt(age),
        sumAssured: parseInt(sumAssured),
        term: parseInt(term),
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
            <Label htmlFor="age">
              {t({ mr: 'तुमचे वय', hi: 'आपकी आयु', en: 'Your Age' })}
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

          <div className="space-y-2">
            <Label htmlFor="sumAssured">
              {t({ mr: 'इच्छित विमा रक्कम', hi: 'वांछित बीमा राशि', en: 'Desired Sum Assured' })}
            </Label>
            <Input
              id="sumAssured"
              type="number"
              min="100000"
              step="50000"
              value={sumAssured}
              onChange={(e) => setSumAssured(e.target.value)}
              placeholder="500000"
            />
            {errors.sumAssured && (
              <p className="text-sm text-destructive">{errors.sumAssured}</p>
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
        </div>

        <Button type="submit" size="lg" className="w-full md:w-auto">
          {t({ mr: 'प्रीमियम मोजा', hi: 'प्रीमियम की गणना करें', en: 'Calculate Premiums' })}
        </Button>
      </form>
    </Card>
  );
}
