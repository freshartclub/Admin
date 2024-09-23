// import { Controller, useFormContext } from 'react-hook-form';

// import { CountrySelect } from 'src/components/country-select';

// // ----------------------------------------------------------------------

// export function RHFCountrySelect({ name, helperText, ...other }) {
//   const { control, setValue } = useFormContext();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => (
//         <CountrySelect
//           id={`rhf-country-select-${name}`}
//           value={field.value}
//           onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
//           error={!!error}
//           helperText={error?.message ?? helperText}
//           {...other}
//         />
//       )}
//     />
//   );
// }

import { Controller, useFormContext, FieldError } from 'react-hook-form';
import { CountrySelect } from 'src/components/country-select';

interface RHFCountrySelectProps {
  name: string;
  helperText?: string;
  // Add any additional props that CountrySelect accepts
  [key: string]: any;
}

// ----------------------------------------------------------------------

export function RHFCountrySelect({ name, helperText, ...other }: RHFCountrySelectProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }: { field: any; fieldState: { error?: FieldError } }) => (
        <CountrySelect
          id={`rhf-country-select-${name}`}
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

