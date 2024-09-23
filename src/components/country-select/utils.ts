import { countries } from 'src/assets/data';

interface Country {
  code: string;
  label: string;
  phone: string;
}

// ----------------------------------------------------------------------

export function getCountry(
  inputValue: string
): { code?: string; label?: string; phone?: string } | undefined {
  const option = countries.find(
    (country: Country) => country.label === inputValue || country.code === inputValue
  );

  return option ? { code: option.code, label: option.label, phone: option.phone } : undefined;
}

// ----------------------------------------------------------------------

export function displayValueByCountryCode(inputValue: string): string | undefined {
  const option = countries.find((country: Country) => country.code === inputValue);

  return option ? option.label : undefined;
}
