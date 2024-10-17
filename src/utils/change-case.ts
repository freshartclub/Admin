// ----------------------------------------------------------------------

export function paramCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ----------------------------------------------------------------------

export function snakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// ----------------------------------------------------------------------

export function sentenceCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function phoneNo(phone: any) {
  return (
    phone?.slice(0, 3) +
    ' ' +
    phone?.slice(3, 6) +
    ' ' +
    phone?.slice(6, 9) +
    ' ' +
    phone?.slice(9, phone?.length)
  );
}
