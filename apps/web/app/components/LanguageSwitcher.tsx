import { useLingui } from "~/i18n/provider";

type SupportedLocale = "en" | "es" | "fr";

const LOCALES: { value: SupportedLocale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Espanol" },
  { value: "fr", label: "Francais" },
];

export function LanguageSwitcher() {
  const { i18n } = useLingui();
  const currentLocale = i18n.locale || "en";

  console.log("LanguageSwitcher render, locale:", currentLocale);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    console.log("Switching locale to:", newLocale);

    // Set cookie to persist the locale
    document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    console.log("Cookie set:", document.cookie);

    // Reload the page to apply the new locale
    window.location.reload();
  };

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      aria-label="Select language"
    >
      {LOCALES.map((locale) => (
        <option key={locale.value} value={locale.value}>
          {locale.label}
        </option>
      ))}
    </select>
  );
}
