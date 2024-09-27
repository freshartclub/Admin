


import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';


import { useRouter } from 'src/routes/hooks';

import {
  _tags,
  PRODUCT_STYLECATEGORYS_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
    styleTitle:zod.string().min(1, { message: 'Title is required!' }),
    styleCategory: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
    
});

// ----------------------------------------------------------------------

type Props = {
  styleFormData?: AddArtistComponentProps;
};

export function AddStyleCategory({ styleFormData }: Props) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
       styleTitle: styleFormData?.styleTitle || '',
        styleCategory:styleFormData?.styleCategory || [],
    }),
    [styleFormData]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(styleFormData ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });


  

  const renderDetails = (
    <Card>
      <CardHeader title="Style" sx={{mb:2}}/>

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
      <Box
          columnGap={4}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
        >
          
          <Field.Text name="styleTitle" label="Title"/>

          <Field.Autocomplete
          name="styleCategory"
          label="Categorys"
          placeholder="+ Categorys"
          multiple
          freeSolo
          disableCloseOnSelect
          options={PRODUCT_STYLECATEGORYS_OPTIONS.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        </Box>
        
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {renderDetails}

      <div className='flex justify-end'>
        <button type='submit' className='px-3 py-2 text-white bg-black rounded-md'>Add</button>
      </div>
      </Stack>
    </Form>
  );
}
