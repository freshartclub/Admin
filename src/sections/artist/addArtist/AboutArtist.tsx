import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import {
  PRODUCT_MODULE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STYLEONE_OPTIONS,
  PRODUCT_STYLETWO_OPTIONS,
  PRODUCT_CATAGORYONE_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  About: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  catagoryone: zod.string().min(1, { message: 'Catagory1 is required!' }),
  styleone: zod.string().min(1, { message: 'Style 1 is required!' }),
  styletwo: zod.string().min(1, { message: 'Style 2 is required!' }),
  ArtworkModule: zod.string().min(1, { message: 'Artwork Module is required!' }),
  ProductStatus: zod.string().min(1, { message: 'ProductStatus is required!' }),
});

// ----------------------------------------------------------------------

export function AboutArtist({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
 }: AddArtistComponentProps) {

  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      About: artistFormData?.About || '',
      catagoryone: artistFormData?.catagoryone || '',
      styleone: artistFormData?.styleone || '',
      styletwo: artistFormData?.styletwo || '',
      ArtworkModule: artistFormData?.ArtworkModule || '',
      ProductStatus: artistFormData?.ProductStatus || '',
    }),
    [artistFormData]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();
  
  useEffect(() => {
    if (window.location.hostname === 'localhost' && window.location.port === '8081') {
      setValue('About', artistFormData?.About || 'Write somthing About Artist content');
      setValue('catagoryone', artistFormData?.catagoryone || 'Catagory1');
      setValue('styleone', artistFormData?.styleone || 'Impressionism');
      setValue('ArtworkModule', artistFormData?.ArtworkModule || 'Module 1');
      setValue('styletwo', artistFormData?.styletwo || 'Pop Art');
      setValue('ProductStatus', artistFormData?.ProductStatus || 'Draft');

    }
  }, [setValue]);


  const onSubmit = handleSubmit(async (data) => {
    trigger(undefined, { shouldFocus: true });

    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;

      return prev;
    });
  });


  const renderDetails = (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="About Artist" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">About</Typography>
          <Field.Editor name="About" sx={{ maxHeight: 480 }} />
        </Stack>
      </Stack>
    </Card>
  );

  const ArtistCatagory = (
    <Card>
      <CardHeader title="Artist Catagory" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="catagoryone"
          label="Catagory 1"
          options={PRODUCT_CATAGORYONE_OPTIONS}
        />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox
            name="styleone"
            label="Style 1"
            options={PRODUCT_STYLEONE_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="styletwo"
            label="Style 2"
            options={PRODUCT_STYLETWO_OPTIONS}
          />
        </Box>
      </Stack>
    </Card>
  );
  const comman = (
    <Card>
      <CardHeader title="Status" sx={{ mb: 1 }} />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="ArtworkModule"
          label="ArtworkModule"
          options={PRODUCT_MODULE_OPTIONS}
        />

        <Field.SingelSelect
          checkbox
          name="ProductStatus"
          label="ProductStatus"
          options={PRODUCT_STATUS_OPTIONS}
        />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!artistFormData ? 'Create product' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            {renderDetails}

            {ArtistCatagory}
          </div>
          <div className="col-span-1">{comman}</div>
        </div>
        <div className="flex justify-end">
          <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
            Save & Next
          </button>
        </div>
      </Stack>
    </Form>
  );
}
