import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { useRouter } from 'src/routes/hooks';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  logName: zod.string().min(1, { message: 'logName is required!' }),
  logAddress: zod.string().min(1, { message: 'Logistic Address is required!' }),
  logZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  logCity: zod.string().min(1, { message: 'City is required!' }),
  logProvince: zod.string().min(1, { message: 'Province is required!' }),
  logCountry: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  logEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  logPhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  logNotes: zod.string(),
});

// ----------------------------------------------------------------------

export function Logistic({
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
      logName: artistFormData?.logName || '',
      logAddress: artistFormData?.logAddress || '',
      logZipCode: artistFormData?.logZipCode || '',
      logCity: artistFormData?.logCity || '',
      logProvince: artistFormData?.logProvince || '',
      logCountry: artistFormData?.country || '',
      logEmail: artistFormData?.logEmail || '',
      logPhone: artistFormData?.logPhone || '',
      logNotes: artistFormData?.logNotes || '',
    }),
    [artistFormData]
  );

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);

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

  console.log(artistFormData)
  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    await trigger(undefined, { shouldFocus: true });
    data.count = 6;

    mutate({ body: data });
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Logistics" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="logName" label="Log name" />

        <Field.Text name="logAddress" label="Logistic Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="logZipCode" label="Log Zip/code" />

          <Field.Text name="logCity" label=" Log City" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="logProvince" label="Log Province/State/Region" />

          <Field.CountrySelect
            fullWidth
            name="logCountry"
            label="Log Country"
            placeholder="Choose a country"
          />

          <Field.Text name="logEmail" label="Email address" />

          <Field.Phone name="logPhone" label="Log Phone number" />
        </Box>

        <Field.Text name="logNotes" label="Log Additional Notes" multiline rows={4} />
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {renderDetails}

        {/* {renderActions} */}
        <div className="flex justify-end">
          <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
          {isPending ? 'Loading...' : 'Save & Next'}
          </button>
        </div>
      </Stack>
    </Form>
  );
}

// this is wiating fro testing
// {

//   import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';
// import { z as zod } from 'zod';
// import { useMemo, useState, useEffect } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { isValidPhoneNumber } from 'react-phone-number-input/input';
// import { useForm } from 'react-hook-form';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Divider from '@mui/material/Divider';
// import CardHeader from '@mui/material/CardHeader';
// import Button from '@mui/material/Button';
// import { useRouter } from 'src/routes/hooks';

// import { Form, Field, schemaHelper } from 'src/components/hook-form';
// import useAddArtistMutation from 'src/http/createArtist/useCreateArtistMutation';

// // ----------------------------------------------------------------------

// export const NewProductSchema = zod.object({
//   logName: zod.string().min(1, { message: 'logName is required!' }),
//   logAddress: zod.string().min(1, { message: 'Logistic Address is required!' }),
//   logZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
//   logCity: zod.string().min(1, { message: 'City is required!' }),
//   logProvince: zod.string().min(1, { message: 'Province is required!' }),
//   logCountry: schemaHelper.objectOrNull({
//     message: { required_error: 'Country is required!' },
//   }),
//   logEmail: zod
//     .string()
//     .min(1, { message: 'Email is required!' })
//     .email({ message: 'Email must be a valid email address!' }),
//   logPhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
//   logNotes: zod.string(),
// });

// // ----------------------------------------------------------------------

// export function Logistic({
//   artistFormData,
//   setArtistFormData,
//   setTabState,
//   setTabIndex,
//   tabIndex,
//   tabState,
// }: AddArtistComponentProps) {
//   const router = useRouter();
//   const [includeTaxes, setIncludeTaxes] = useState(false);

//   // Handle success function
//   const handleSuccess = (data: any) => {
//     setArtistFormData({ ...artistFormData, ...data });
//     setTabIndex(tabIndex + 1);
//     setTabState((prev) => {
//       prev[tabIndex].isSaved = true;
//       return prev;
//     });
//   };

//   // Mutation hook for adding artist
//   const { isPending, mutate } = useAddArtistMutation(handleSuccess);

//   // Default values for the form fields
//   const defaultValues = useMemo(() => {
//     return {
//       logName: artistFormData?.logName || '',
//       logAddress: artistFormData?.logAddress || '',
//       logZipCode: artistFormData?.logZipCode || '',
//       logCity: artistFormData?.logCity || '',
//       logProvince: artistFormData?.logProvince || '',
//       logCountry: artistFormData?.logCountry || '',
//       logEmail: artistFormData?.logEmail || '',
//       logPhone: artistFormData?.logPhone || '',
//       logNotes: artistFormData?.logNotes || '',
//     };
//   }, [artistFormData]);

//   // Form props using the useForm hook
//   const formProps = useForm({
//     resolver: zodResolver(NewProductSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     watch,
//     setValue,
//     trigger,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = formProps;

//   // Populate default values in development mode for easier testing
//   useEffect(() => {
//     if (window.location.hostname === 'localhost') {
//       setValue('logName', artistFormData?.logName || 'John');
//       setValue('logAddress', artistFormData?.logAddress || '121 c21 vijay nager');
//       setValue('logZipCode', artistFormData?.logZipCode || '12345');
//       setValue('logCity', artistFormData?.logCity || 'Indore');
//       setValue('logProvince', artistFormData?.logProvince || 'Madhay Pradesh');
//       setValue('logCountry', artistFormData?.logCountry || 'USA');
//       setValue('logEmail', artistFormData?.logEmail || 'Artist@gmail.com');
//       setValue('logPhone', artistFormData?.logPhone || '+919165323561');
//       setValue(
//         'logNotes',
//         artistFormData?.logNotes || 'Hi this is testing Data Additional Notes'
//       );
//     }
//   }, [setValue]);

//   // Form submit handler
//   const onSubmit = handleSubmit(async (data) => {
//     trigger(undefined, { shouldFocus: true });
//     mutate(data);  // Use mutate for handling submission
//   });

//   const renderDetails = (
//     <Card>
//       <CardHeader title="Logistics" sx={{ mb: 3 }} />
//       <Divider />
//       <Stack spacing={3} sx={{ p: 3 }}>
//         <Field.Text name="logName" label="Log name" />
//         <Field.Text name="logAddress" label="Logistic Address" />
//         <Box
//           columnGap={2}
//           rowGap={3}
//           display="grid"
//           gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
//         >
//           <Field.Text name="logZipCode" label="Log Zip/code" />
//           <Field.Text name="logCity" label="Log City" />
//         </Box>
//         <Box
//           columnGap={2}
//           rowGap={3}
//           display="grid"
//           gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
//         >
//           <Field.Text name="logProvince" label="Log Province/State/Region" />
//           <Field.CountrySelect
//             fullWidth
//             name="logCountry"
//             label="Log Country"
//             placeholder="Choose a country"
//           />
//           <Field.Text name="logEmail" label="Email address" />
//           <Field.Phone name="logPhone" label="Log Phone number" />
//         </Box>
//         <Field.Text name="logNotes" label="Log Additional Notes" multiline rows={4} />
//       </Stack>
//     </Card>
//   );

//   return (
//     <Form methods={formProps} onSubmit={onSubmit}>
//       <Stack spacing={{ xs: 3, md: 5 }}>
//         {renderDetails}
//         <div className="flex justify-end">
//           <Button type="submit" variant="contained">
//             Save & Next
//           </Button>
//         </div>
//       </Stack>
//     </Form>
//   );
// }

// }
