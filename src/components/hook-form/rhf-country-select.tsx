import { Controller, useFormContext, FieldError } from 'react-hook-form';
import { CountrySelect } from 'src/components/country-select';

interface RHFCountrySelectProps {
  name: string;
  helperText?: string;
  [key: string]: any;
}

// ----------------------------------------------------------------------

export function RHFCountrySelect({ name, setCode, helperText, ...other }: RHFCountrySelectProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState: { error },
      }: {
        field: any;
        fieldState: { error?: FieldError };
      }) => (
        <CountrySelect
          id={`rhf-country-select-${name}`}
          setCode={setCode}
          value={field.value}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}
