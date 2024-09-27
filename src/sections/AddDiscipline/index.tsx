

import type { IProductItem } from 'src/types/product';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// import {
//   _tags,
//   PRODUCT_SIZE_OPTIONS,
//   PRODUCT_GENDER_OPTIONS,
//   PRODUCT_COLOR_NAME_OPTIONS,
//   PRODUCT_CATEGORY_GROUP_OPTIONS,
// } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
    addDisciplinImage: schemaHelper.file({ message: { required_error: 'image is required!' } }),
    disciplineTitle:zod.string().min(1, { message: 'Title is required!' }),
    disciplineDescription:zod.string().min(1, { message: 'Discription is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  disciplineFormData?: IProductItem;
};

export function AddDisciline({ disciplineFormData }: Props) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
        addDisciplinImage: disciplineFormData?.addDisciplinImage || null,
        disciplineTitle: disciplineFormData?.disciplineTitle || '',
        disciplineDescription:disciplineFormData?.disciplineDescription || '',
    }),
    [disciplineFormData]
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

//   const values = watch();

//   useEffect(() => {
//     if (disciplineFormData) {
//       reset(defaultValues);
//     }
//   }, [disciplineFormData, defaultValues, reset]);

//   useEffect(() => {
//     if (includeTaxes) {
//       setValue('taxes', 0);
//     } else {
//       setValue('taxes', disciplineFormData?.taxes || 0);
//     }
//   }, [disciplineFormData?.taxes, includeTaxes, setValue]);
const handleRemoveFile = useCallback(() => {
    setValue('addDisciplinImage', null);
  }, [setValue]);



  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(disciplineFormData ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });


  

  const renderDetails = (
    <Card>
      <CardHeader title="Discipline"  sx={{mb:2}}/>

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
      <Box
          columnGap={4}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <div >
            <Typography variant="addDisciplinImage">Add Image</Typography>
            <Field.Upload name="addDisciplinImage" maxSize={3145728} onDelete={handleRemoveFile} />
          </div>
          <div className='form col-span-2'>
            <div className='mb-7 mt-7'>
            <Field.Text name="disciplineTitle" label="Title"/>
            </div>
      
          <Field.Text name="disciplineDescription" label="Description" multiline rows={6} />
          </div>
        </Box>
        
      </Stack>
    </Card>
  );


//     <Card>
//       <CardHeader title="Pricing" subheader="Price related inputs" sx={{ mb: 3 }} />

//       <Divider />

//       <Stack spacing={3} sx={{ p: 3 }}>
//         <Field.Text
//           name="price"
//           label="Regular price"
//           placeholder="0.00"
//           type="number"
//           InputLabelProps={{ shrink: true }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Box component="span" sx={{ color: 'text.disabled' }}>
//                   $
//                 </Box>
//               </InputAdornment>
//             ),
//           }}
//         />

//         <Field.Text
//           name="priceSale"
//           label="Sale price"
//           placeholder="0.00"
//           type="number"
//           InputLabelProps={{ shrink: true }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Box component="span" sx={{ color: 'text.disabled' }}>
//                   $
//                 </Box>
//               </InputAdornment>
//             ),
//           }}
//         />

//         <FormControlLabel
//           control={
//             <Switch id="toggle-taxes" checked={includeTaxes} onChange={handleChangeIncludeTaxes} />
//           }
//           label="Price includes taxes"
//         />

//         {!includeTaxes && (
//           <Field.Text
//             name="taxes"
//             label="Tax (%)"
//             placeholder="0.00"
//             type="number"
//             InputLabelProps={{ shrink: true }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Box component="span" sx={{ color: 'text.disabled' }}>
//                     %
//                   </Box>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         )}
//       </Stack>
//     </Card>
//   );

  

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
