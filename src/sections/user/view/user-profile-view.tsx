import { zodResolver } from '@hookform/resolvers/zod';
import { CardHeader, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { DashboardContent } from 'src/layouts/dashboard';
import { useParams, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { useGetUserById } from '../http/useGetUserById';
import { ProfileCover } from '../profile-cover';
import countryFile from '../../artist/addArtist/country.json';

// ----------------------------------------------------------------------

const NewProductSchema = zod.object({
  userId: zod.string().min(1, { message: 'User ID is required!' }),
  artistName: zod.string().min(1, { message: 'Artist Name is required!' }),
  artistSurname1: zod.string().min(1, { message: 'Surname 1 is required!' }),
  artistSurname2: zod.string(),
  nickName: zod.string(),
  country: zod.string().min(1, { message: 'Country is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'state is required!' }),
  residentialAddress: zod.string().min(1, { message: 'Residential Address is required!' }),
  phone: zod.string().min(1, { message: 'Phone is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email!' }),
  gender: zod.string().min(1, { message: 'Gender is required!' }),
});

export function UserProfileView() {
  const id = useParams().id;
  const mode = useSearchParams().get('mode');
  const [code, setCode] = useState('');

  const isReadOnly = mode == 'edit' ? false : true;

  if (!id) return toast.error('User not found');
  const { data, isLoading } = useGetUserById(id);

  const defaultValues = useMemo(
    () => ({
      userId: data?.userId || '',
      artistName: data?.artistName || '',
      artistSurname1: data?.artistSurname1 || '',
      artistSurname2: data?.artistSurname2 || '',
      nickName: data?.nickName || '',
      country: data?.address?.country || '',
      zipCode: data?.address?.zipCode || '',
      city: data?.address?.city || '',
      state: data?.address?.state || '',
      residentialAddress: data?.address?.residentialAddress || '',
      phone: data?.phone || '',
      email: data?.email || '',
      gender: data?.gender || '',
    }),
    [data]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = formProps;

  useEffect(() => {
    reset(defaultValues);
  }, [data]);

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  useEffect(() => {
    if (data?.phone) {
      const findCode = countryFile.find((item) => data?.phone?.includes(item.idd));
      setCode(findCode?.cca2 || '');
    }
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: data?.userId },
        ]}
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Card sx={{ mb: 3, height: 290 }}>
            <ProfileCover
              role={data?.role}
              name={name(data)}
              avatarUrl={data?.profile?.mainImage}
              coverUrl={data?.profile?.inProcessImage}
            />
          </Card>
          <Form methods={formProps}>
            <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="border p-2">
              <CardHeader title="User Details" className="!p-2" />
              <Divider />
              <Field.Text disabled={isReadOnly} name="userId" label="User ID" />
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
              >
                <Field.Text disabled={isReadOnly} required name="artistName" label="User Name" />

                <Field.Text
                  disabled={isReadOnly}
                  required
                  name="artistSurname1"
                  label="User Surname 1"
                />

                <Field.Text disabled={isReadOnly} name="artistSurname2" label="User Surname 2" />
              </Box>

              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >
                <Field.Text disabled={isReadOnly} name="nickName" label="User Nickname" />
                <Field.Text disabled={isReadOnly} name="email" label="Email" />
              </Box>

              <Field.CountrySelect
                required
                fullWidth
                name="country"
                label="Country"
                placeholder="Choose a country"
                disabled={isReadOnly}
              />

              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
              >
                <Field.Text disabled={isReadOnly} required name="zipCode" label="Zip/code" />
                <Field.Text disabled={isReadOnly} required name="city" label="City" />
                <Field.Text disabled={isReadOnly} required name="state" label="State/Region" />
              </Box>

              <Field.Text
                required
                name="residentialAddress"
                disabled={isReadOnly}
                label="Residential Address"
              />

              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >
                <Field.Phone
                  fetchCode={code ? code : ''}
                  disabled={isReadOnly}
                  required
                  name="phone"
                  label="Phone number"
                />
                <Field.Text required name="gender" disabled={isReadOnly} label="Gender" />
              </Box>
            </Card>
          </Form>
        </>
      )}
    </DashboardContent>
  );
}
