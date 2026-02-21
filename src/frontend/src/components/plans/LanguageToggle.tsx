import { Button } from '@/components/ui/button';
import { useLanguage } from '../../hooks/useLanguage';
import { Language } from '../../types/translations';
import { uiLabels } from '../../data/planTranslations';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ['mr', 'hi', 'en'];

  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
      {languages.map((lang) => (
        <Button
          key={lang}
          variant={language === lang ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage(lang)}
          className={`transition-all ${
            language === lang
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'hover:bg-muted'
          }`}
        >
          {uiLabels.languageToggle[lang]}
        </Button>
      ))}
    </div>
  );
}
