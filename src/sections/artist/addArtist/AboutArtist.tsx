import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import {
  PRODUCT_STYLE_OPTIONS,
  PRODUCT_MEDIA_OPTIONS,
  // PRODUCT_STYLEONE_OPTIONS,
  PRODUCT_MODULE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_TECHNIC_OPTIONS,
  PRODUCT_SUPPORT_OPTIONS,
  // PRODUCT_STYLETWO_OPTIONS,
  PRODUCT_CATAGORYONE_OPTIONS,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const ArtistCatagory = zod.object({
  catagoryone: zod.string({ required_error: 'Category one is required!' }),
  styleone: zod.string({ required_error: 'Style 1 is required!' }),
  styletwo: zod.string({ required_error: 'Style 2 is required!' }),
});

export const NewProductSchema = zod.object({
  About: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  catagory: zod.array(
    zod.object({
      catagoryone: zod.string().min(1, { message: 'Catagory1 is required!' }),
      style: zod.string().min(1, { message: 'style is required!' }),
      media: zod.string().min(1, { message: 'media is required!' }),
      technic: zod.string().min(1, { message: 'technic is required!' }),
      support: zod.string().min(1, { message: 'support is required!' }),
    })
  ),
  // styleone: zod.string().min(1, { message: 'Style 1 is required!' }),
  // styletwo: zod.string().min(1, { message: 'Style 2 is required!' }),
  ArtworkModule: zod.string().min(1, { message: 'Artwork Module is required!' }),
  ProductStatus: zod.string().min(1, { message: 'ProductStatus is required!' }),
  emegencyNameOfContact: zod.string().min(1, { message: 'Name of Contact is required!' }),
  emegencyContactTo: zod.string().min(1, { message: 'Contact to is required!' }),
  emegencyPhoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  emegencyEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
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

  const defaultValues = useMemo(() => {
    const catagortDefault = [
      {
        catagoryone: '',
        style: '',
        media: '',
        technic: '',
        support: '',
      },
    ];

    const val = {
      About: artistFormData?.About || '',
      catagory: artistFormData?.catagory || catagortDefault,
      // styleone: artistFormData?.styleone || '',
      // styletwo: artistFormData?.styletwo || '',
      ArtworkModule: artistFormData?.ArtworkModule || '',
      ProductStatus: artistFormData?.ProductStatus || '',
      emegencyNameOfContact: artistFormData?.emegencyNameOfContact || '',
      emegencyContactTo: artistFormData?.emegencyContactTo || '',
      emegencyPhoneNumber: artistFormData?.emegencyPhoneNumber || '',
      emegencyEmail: artistFormData?.emegencyEmail || '',
    };
    return val;
  }, [artistFormData]);

  // const methods = useForm({
  //   resolver: zodResolver(NewProductSchema),
  //   defaultValues,
  // });
  const formProps = useForm({
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
  } = formProps;
  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'catagory',
  });

  const handleRemove = (index) => {
    remove(index);
  };
  // const values = watch();

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setValue('About', artistFormData?.About || 'Write somthing About Artist content');
      // setValue('catagoryone', artistFormData?.catagoryone || 'Catagory1');
      // setValue('styleone', artistFormData?.styleone || 'Impressionism');
      setValue('ArtworkModule', artistFormData?.ArtworkModule || 'Module 1');
      // setValue('styletwo', artistFormData?.styletwo || 'Pop Art');
      setValue('ProductStatus', artistFormData?.ProductStatus || 'Draft');
      setValue('emegencyNameOfContact', artistFormData?.emegencyNameOfContact || 'Deo');
      setValue('emegencyContactTo', artistFormData?.emegencyContactTo || 'Alish');
      setValue('emegencyPhoneNumber', artistFormData?.emegencyPhoneNumber || '+919165325634');
      setValue('emegencyEmail', artistFormData?.emegencyEmail || 'AdminAlish@gmail.com');

      if (artistFormData?.catagory?.length === 1) {
        setValue('catagory', artistFormData.catagory);
      } else {
        const mockData = [
          {
            catagoryone: 'Paintings',
            style: 'Figurative',
            media: 'Oil',
            technic: 'Nature',
            support: 'Canvas',
          },
        ];

        mockData.forEach((item) => append(item));
      }
    }
  }, [setValue]);

  const addCategory = () => {
    append({
      catagoryone: '',
    });
  };

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
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Artist Catagory" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        {/* try start */}
        <Stack>
          <div className="flex justify-end">
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addCategory}
            >
              Add More Category
            </Button>
          </div>
          {fields.map((item, index) => (
            <Stack
              key={item.id}
              aligncvs={{ xs: 'flex-center', md: 'flex-end' }}
              spacing={1.5}
              className="mb-7"
            >
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
              >
                <Field.SingelSelect
                  checkbox
                  name={`catagory[${index}].catagoryone`}
                  label="Catagory 1"
                  options={PRODUCT_CATAGORYONE_OPTIONS}
                />
                <Box
                  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
                >
                  <Field.SingelSelect
                    checkbox
                    name={`catagory[${index}].style`}
                    label="Style"
                    options={PRODUCT_STYLE_OPTIONS}
                  />
                  <Field.SingelSelect
                    checkbox
                    name={`catagory[${index}].media`}
                    label="Media"
                    options={PRODUCT_MEDIA_OPTIONS}
                  />
                  <Field.SingelSelect
                    checkbox
                    name={`catagory[${index}].technic`}
                    label="Technic"
                    options={PRODUCT_TECHNIC_OPTIONS}
                  />
                  <Field.SingelSelect
                    checkbox
                    name={`catagory[${index}].support`}
                    label="Support"
                    options={PRODUCT_SUPPORT_OPTIONS}
                  />
                </Box>
              </Box>

              {index !== 0 ? (
                <div className="flex justify-end mb-2">
                  <Button
                    size="small"
                    color="error"
                    className="flex justify-end"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ) : null}
            </Stack>
          ))}
        </Stack>
        {/* try end */}

        {/* <Box
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
        </Box> */}
      </Stack>
    </Card>
  );

  const Emergency = (
    <Card className="">
      <CardHeader title="Emergency contact information" sx={{ mb: 1 }} />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="emegencyNameOfContact" label="Name of Contact" />
          <Field.Text name="emegencyContactTo" label="Contact To" />
          <Field.Phone name="emegencyPhoneNumber" label="Contact number" helperText="Good to go" />
          <Field.Text name="emegencyEmail" label="Email Address" />
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
    <FormProvider {...formProps}>
      <form onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              {renderDetails}

              {ArtistCatagory}

              {Emergency}
            </div>
            <div className="col-span-1">{comman}</div>
          </div>
          <div className="flex justify-end">
            <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
              Save & Next
            </button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  );
}
