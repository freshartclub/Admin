import type { TextFieldProps } from '@mui/material/TextField';

import { useFormContext } from 'react-hook-form';
import Autocomplete from 'react-google-autocomplete';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export function GooglePlacesAutoComplete({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <div className="z-[100000]">
      <Autocomplete
        libraries={['places']}
        options={{
          types: [],
        }}
        apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
      />
    </div>
  );
}
