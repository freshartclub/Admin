import React from 'react';
import axios from 'axios';
import Autocomplete from 'react-google-autocomplete';
import TextField from '@mui/material/TextField';

export interface AutoCompleteProps {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  helperText?: string;
  error?: boolean;
}

const AddressAutoComplete = ({
  label,
  name,
  value,
  disabled,
  onChange,
  onPlaceSelected,
  helperText,
  error,
}: AutoCompleteProps) => {
  const [city, setCity] = React.useState('');

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => setCity(event.target.value)}
      error={error}
      helperText={helperText}
      InputProps={{
        inputComponent: Autocomplete as any,
        inputProps: {
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          onPlaceSelected,
          value: value,
          onChange,
          options: {
            types: [],
          },
          style: { border: 'none', outline: 'none', fontSize: '1rem' },
        },
      }}
    />
  );
};

const getCityStateFromZipCountry = async (zipCode: string, country: string, apiKey: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        zipCode + ',' + country
      )}&key=${apiKey}`
    );

    if (response.data.status !== 'OK') {
      throw new Error(`Geocoding API Error: ${response.data.status}`);
    }

    const results = response.data.results[0];
    const addressComponents = results.address_components;

    const city = addressComponents.find((component) =>
      component.types.includes('locality')
    )?.long_name;

    const state = addressComponents.find((component) =>
      component.types.includes('administrative_area_level_1')
    )?.long_name;

    return { city, state };
  } catch (error) {
    console.error('Error fetching City and State:', error);
    return { city: '', state: '' };
  }
};

export { AddressAutoComplete, getCityStateFromZipCountry };
