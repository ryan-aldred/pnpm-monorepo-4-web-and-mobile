import { useLingui } from "~/i18n/provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type SupportedLocale = "en" | "es" | "fr";

const LOCALES: { value: SupportedLocale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Espanol" },
  { value: "fr", label: "Francais" },
];

export function LanguageSwitcher() {
  const { i18n } = useLingui();
  const currentLocale = i18n.locale || "en";

  const handleChange = (newLocale: string) => {
    // Set cookie to persist the locale
    document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;

    // Reload the page to apply the new locale
    window.location.reload();
  };

  return (
    <Select value={currentLocale} onValueChange={handleChange}>
      <SelectTrigger className="w-[130px]" aria-label="Select language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((locale) => (
          <SelectItem key={locale.value} value={locale.value}>
            {locale.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
