import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useSearchParams } from 'src/routes/hooks';
import { RenderAllPicklists } from 'src/sections/Picklists/RenderAllPicklist';
import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';
import { useGetReviewArtist } from './http/useGetReviewArtist';
import { LoadingScreen } from 'src/components/loading-screen';
import { Typography } from '@mui/material';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';
import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { useApproveArtistChanges } from './http/useApproveArtistChanges';
import { useRejectChanges } from './http/useRejectChanges';

// ----------------------------------------------------------------------

export function ArtistReview({}) {
  const id = useSearchParams().get('id');
  const isReadOnly = true;

  const { data, isLoading } = useGetReviewArtist(id);

  let imgArr: any = [];
  let videoArr: any = [];
  let updatedImgArr: any = [];
  let updatedVideoArr: any = [];

  if (id && data?.data) {
    data?.data?.profile?.additionalImage &&
      data?.data?.profile?.additionalImage.length > 0 &&
      data?.data?.profile?.additionalImage.forEach((item: any, i) =>
        imgArr.push(`${data?.url}/users/${item}`)
      );
    data?.data?.profile?.additionalVideo &&
      data?.data?.profile?.additionalVideo.length > 0 &&
      data?.data?.profile?.additionalVideo.forEach((item: any, i) =>
        videoArr.push(`${data?.url}/videos/${item}`)
      );
  }

  if (id && data?.data?.reviewDetails) {
    data?.data?.reviewDetails?.profile?.additionalImage &&
      data?.data?.reviewDetails?.profile?.additionalImage.length > 0 &&
      data?.data?.reviewDetails?.profile?.additionalImage.forEach((item: any, i) =>
        updatedImgArr.push(`${data?.url}/users/${item}`)
      );
    data?.data?.reviewDetails?.profile?.additionalVideo &&
      data?.data?.reviewDetails?.profile?.additionalVideo.length > 0 &&
      data?.data?.reviewDetails?.profile?.additionalVideo.forEach((item: any, i) =>
        updatedVideoArr.push(`${data?.url}/videos/${item}`)
      );
  }

  const defaultValues = useMemo(
    () => ({
      about: data?.data?.aboutArtist?.about || '',
      chnagedAbout: data?.data?.reviewDetails?.aboutArtist?.about || '',
      addHighlights: data?.data?.highlights?.addHighlights || '',
      chnagedAddHighlights: data?.data?.reviewDetails?.highlights?.addHighlights || '',
      mainImage: data?.data?.profile?.mainImage || null,
      additionalImage: imgArr || [],
      inProcessImage: data?.data?.profile?.inProcessImage || null,
      mainVideo: data?.data?.profile?.mainVideo || null,
      additionalVideo: videoArr || [],
      updatedMainImage: data?.data?.reviewDetails?.profile?.mainImage || null,
      updatedAdditionalImage: updatedImgArr || [],
      updatedInProcessImage: data?.data?.reviewDetails?.profile?.inProcessImage || null,
      updatedMainVideo: data?.data?.reviewDetails?.profile?.mainVideo || null,
      updatedAdditionalVideo: updatedVideoArr || [],
    }),
    [data?.data]
  );

  const formProps = useForm({
    defaultValues,
  });

  const { reset } = formProps;
  const { mutate, isPending } = useApproveArtistChanges(data?.data?.reviewDetails, id);
  const { mutate: rejectMutate, isPending: rejectPending } = useRejectChanges(id);

  const handleApprove = () => {
    mutate();
  };

  const handleReject = () => {
    rejectMutate();
  };

  useEffect(() => {
    if (data?.data) {
      reset({
        about: data?.data?.aboutArtist?.about || '',
        chnagedAbout: data?.data?.reviewDetails?.aboutArtist?.about || '',
        addHighlights: data?.data?.highlights?.addHighlights || '',
        chnagedAddHighlights: data?.data?.reviewDetails?.highlights?.addHighlights || '',
        mainImage: data?.data?.profile?.mainImage
          ? `${data?.url}/users/${data?.data?.profile?.mainImage}`
          : null,
        additionalImage: imgArr || [],
        inProcessImage: data?.data?.profile?.inProcessImage
          ? `${data?.url}/users/${data?.data?.profile?.inProcessImage}`
          : null,
        mainVideo: data?.data?.profile?.mainVideo
          ? `${data?.url}/videos/${data?.data?.profile?.mainVideo}`
          : null,
        additionalVideo: videoArr || [],
        updatedMainImage: data?.data?.reviewDetails?.profile?.mainImage
          ? `${data?.url}/users/${data?.data?.reviewDetails?.profile?.mainImage}`
          : null,
        updatedAdditionalImage: updatedImgArr || [],
        updatedInProcessImage: data?.data?.reviewDetails?.profile?.inProcessImage
          ? `${data?.url}/users/${data?.data?.reviewDetails?.profile?.inProcessImage}`
          : null,
        updatedMainVideo: data?.data?.reviewDetails?.profile?.mainVideo
          ? `${data?.url}/videos/${data?.data?.reviewDetails?.profile?.mainVideo}`
          : null,
        updatedAdditionalVideo: updatedVideoArr || [],
      });
    }
  }, [data?.data]);

  const rendergeneralDetails = (
    <Card>
      <CardHeader title="General Informations" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.artistName}
            required
            name="artistName"
            label="Artist name"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.artistSurname1}
            required
            name="artistSurname1"
            label="Artist Surname 1"
          />
          <Field.Text
            value={data?.data?.artistSurname2}
            disabled={isReadOnly}
            name="artistSurname2"
            label="Artist Surname 2"
          />
          <Field.Text
            value={data?.data?.nickName}
            disabled={isReadOnly}
            name="NickName"
            label="Artist Nickname"
          />
          <Field.Text disabled={isReadOnly} value={data?.data?.email} name="email" label="Email" />

          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.gender}
            name="gender"
            label="Gender"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.language}
            name="language"
            label="Language"
          />
          <Field.Text disabled={isReadOnly} value={data?.data?.phone} name="phone" label="Phone" />

          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.dob}
            name="dob"
            label="Date of Birth"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.address?.country}
            name="country"
            label="Country"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.address?.zipCode}
            name="zipCode"
            label="Zip Code"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.address?.city}
            name="city"
            label="City"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.address?.state}
            name="state"
            label="State"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.address?.residentialAddress}
            name="residentialAddress"
            label="Residential Address"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.artistName}
            required
            name="artistName"
            label="Updated Artist name"
          />
          <Field.Text
            disabled={isReadOnly}
            required
            value={data?.data?.reviewDetails?.artistSurname1}
            name="artistSurname1"
            label="Updated Artist Surname 1"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.artistSurname2}
            name="artistSurname2"
            label="Updated Artist Surname 2"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.nickName}
            name="nickName"
            label="Updated Artist Nickname"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.email || 'N/A'}
            name="email"
            label="Updated Email"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.gender}
            name="gender"
            label="Updated Gender"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.language}
            name="language"
            label="Updated Language"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.phone}
            name="phone"
            label="Updated Phone"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.dob}
            name="dob"
            label="Updated Date of Birth"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.address?.country}
            name="country"
            label="Updated Country"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.address?.zipCode}
            name="zipCode"
            label="Updated Zip Code"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.address?.city}
            name="city"
            label="Updated City"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.address?.state}
            name="state"
            label="Updated State"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.data?.reviewDetails?.address?.residentialAddress}
            name="residentialAddress"
            label="Updated Residential Address"
          />
        </Box>
      </Stack>
    </Card>
  );

  const aboutArtist = (
    <Card>
      <CardHeader title="About Artist" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Editor required disabled={isReadOnly} name="about" sx={{ maxHeight: 480 }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Editor
            required
            disabled={isReadOnly}
            name="chnagedAbout"
            sx={{ maxHeight: 480 }}
          />
        </Box>
      </Stack>
    </Card>
  );

  const highLight = (
    <Card>
      <CardHeader title="HighLight" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Editor
            required
            disabled={isReadOnly}
            name="addHighlights"
            sx={{ maxHeight: 480 }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Editor
            required
            disabled={isReadOnly}
            name="chnagedAddHighlights"
            sx={{ maxHeight: 480 }}
          />
        </Box>
      </Stack>
    </Card>
  );

  const links = (
    <Card>
      <CardHeader title="Social Links" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          {data?.data?.links && data?.data?.links.length > 0 ? (
            data?.data?.links.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                gap={2}
              >
                <Typography sx={{ fontWeight: 'bold' }}>Social Link - {index + 1}</Typography>
                <Field.Text
                  disabled={isReadOnly}
                  name="Platform Name"
                  value={item.name}
                  label="Platform Name"
                />
                <Field.Text disabled={isReadOnly} name="link" value={item.link} label="Link" />
              </Box>
            ))
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
              <Typography sx={{ fontWeight: 'bold' }}>No Social Links Found</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          {data?.data?.reviewDetails?.links && data?.data?.reviewDetails?.links.length > 0 ? (
            data?.data?.links.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                gap={2}
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  Updated Social Link - {index + 1}
                </Typography>
                <Field.Text
                  disabled={isReadOnly}
                  name="uadtedPlatformName"
                  value={item.name}
                  label="Platform Name"
                />
                <Field.Text
                  disabled={isReadOnly}
                  name="updatedLink"
                  value={item.link}
                  label="Link"
                />
              </Box>
            ))
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
              <Typography sx={{ fontWeight: 'bold' }}>No Social Links Found</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );

  const cvDetails = (
    <Card>
      <CardHeader title="CV Details" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          {data?.data?.highlights?.cv && data?.data?.highlights?.cv.length > 0 ? (
            data?.data?.highlights?.cv.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                gap={2}
              >
                <Typography sx={{ fontWeight: 'bold' }}>CV - {index + 1}</Typography>
                <Field.Text
                  value={item.year}
                  disabled={isReadOnly}
                  name={`cvData[${index}].year`}
                  label="Year"
                />
                <Field.Text
                  value={item.Type}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Type`}
                  label="Type"
                />
                <Field.Text
                  value={item.Description}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Description`}
                  label="Description"
                />
                <Field.Text
                  value={item.Location}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Location`}
                  label="Location"
                />
                <Field.Text
                  value={item.Scope}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Scope`}
                  label="Scope"
                />
              </Box>
            ))
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
              <Typography sx={{ fontWeight: 'bold' }}>No CV Details Found</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          {data?.data?.reviewDetails.highlights?.cv &&
          data?.data?.reviewDetails.highlights?.cv.length > 0 ? (
            data?.data?.reviewDetails.highlights?.cv.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                gap={2}
              >
                <Typography sx={{ fontWeight: 'bold' }}>Updated CV - {index + 1}</Typography>
                <Field.Text
                  value={item.year}
                  disabled={isReadOnly}
                  name={`cvData[${index}].year`}
                  label="Year"
                />
                <Field.Text
                  value={item.Type}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Type`}
                  label="Type"
                />
                <Field.Text
                  value={item.Description}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Description`}
                  label="Description"
                />
                <Field.Text
                  value={item.Location}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Location`}
                  label="Location"
                />
                <Field.Text
                  value={item.Scope}
                  disabled={isReadOnly}
                  name={`cvData[${index}].Scope`}
                  label="Scope"
                />
              </Box>
            ))
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
              <Typography sx={{ fontWeight: 'bold' }}>No Changed CV Details Found</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );

  const mangerDetails = (
    <Card>
      <CardHeader title="Manager Details" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        {data?.data?.isManagerDetails && data?.data?.isManagerDetails === true ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
            <Field.Text
              value={data?.data?.managerDetails?.managerName || ''}
              disabled={isReadOnly}
              name="managerName"
              label="Manager Name"
            />
            <Field.Text
              value={data?.data?.managerDetails?.managerEmail || ''}
              disabled={isReadOnly}
              name="managerEmail"
              label="Manager Email"
            />
            <Field.Text
              value={data?.data?.managerDetails?.managerPhoneNumber || ''}
              disabled={isReadOnly}
              name="managerPhoneNumber"
              label="Manager Phone Number"
            />
            <Field.Text
              value={data?.data?.managerDetails?.managerGender || ''}
              disabled={isReadOnly}
              name="managerGender"
              label="Manager Gender"
            />
            <Field.Text
              value={data?.data?.managerDetails?.address?.address || ''}
              disabled={isReadOnly}
              name="managerAddress"
              label="Manager Address"
            />
            <Field.Text
              value={data?.data?.managerDetails?.address?.city || ''}
              disabled={isReadOnly}
              name="managerCity"
              label="Manager City"
            />
            <Field.Text
              value={data?.data?.managerDetails?.address?.state || ''}
              disabled={isReadOnly}
              name="managerState"
              label="Manager State"
            />
            <Field.Text
              value={data?.data?.managerDetails?.address?.zipCode || ''}
              disabled={isReadOnly}
              name="managerZipCode"
              label="Manager Zip Code"
            />
            <Field.Text
              value={data?.data?.managerDetails?.address?.country || ''}
              disabled={isReadOnly}
              name="managerCountry"
              label="Manager Country"
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
            <Typography sx={{ fontWeight: 'bold' }}>No Manager Details</Typography>
          </Box>
        )}

        {data?.data?.reviewDetails?.isManagerDetails &&
        data?.data?.reviewDetails?.isManagerDetails === true ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.managerName || ''}
              disabled={isReadOnly}
              name="changedManagerName"
              label="Updated Manager Name"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.managerEmail || ''}
              disabled={isReadOnly}
              name="UpdatedManagerEmail"
              label="Updated Manager Email"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.managerPhoneNumber || ''}
              disabled={isReadOnly}
              name="UpdatedManagerPhoneNumber"
              label="Updated Manager Phone Number"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.managerGender || ''}
              disabled={isReadOnly}
              name="UpdatedManagerGender"
              label="Updated Manager Gender"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.address?.address || ''}
              disabled={isReadOnly}
              name="UpdatedManagerAddress"
              label="Updated Manager Address"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.address?.city || ''}
              disabled={isReadOnly}
              name="managerCity"
              label="Updated Manager City"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.address?.state || ''}
              disabled={isReadOnly}
              name="UpdatedManagerState"
              label="Updated Manager State"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.address?.zipCode || ''}
              disabled={isReadOnly}
              name="UpdatedManagerZipCode"
              label="Updated Manager Zip Code"
            />
            <Field.Text
              value={data?.data?.reviewDetails?.managerDetails?.address?.country || ''}
              disabled={isReadOnly}
              name="UpdatedManagerCountry"
              label="Updated Manager Country"
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
            <Typography sx={{ fontWeight: 'bold' }}>No Changed Manager Details</Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );

  const renderProfile = (
    <Card>
      <CardHeader title="Media" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <div>
            <Typography>Profile Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="mainImage" />
          </div>
          <div>
            <Typography>Additional Image</Typography>
            <Field.Upload multiple disabled={isReadOnly} thumbnail name="additionalImage" />
          </div>
          <div>
            <Typography>Inprocess Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="inProcessImage" />
          </div>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <div>
            <Typography>Updated Profile Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="updatedMainImage" />
          </div>
          <div>
            <Typography>Updated Additional Image</Typography>
            <Field.Upload multiple disabled={isReadOnly} thumbnail name="updatedAdditionalImage" />
          </div>
          <div>
            <Typography>Updated Inprocess Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="updatedInProcessImage" />
          </div>
        </Box>
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <Form methods={formProps}>
      <Stack spacing={{ xs: 3, md: 3 }}>
        {rendergeneralDetails}
        {aboutArtist}
        {renderProfile}
        {highLight}
        {cvDetails}
        {links}
        {mangerDetails}

        <div className="flex gap-2 justify-end">
          <span onClick={handleApprove} className="text-white bg-black rounded-md px-3 py-2">
            {isPending ? 'Approving...' : 'Approve Changes'}
          </span>

          <span
            onClick={handleReject}
            className="text-white bg-red-500 rounded-md px-3 py-2 cursor-pointer"
          >
            {rejectPending ? 'Rejecting...' : 'Reject Changes'}
          </span>
        </div>
      </Stack>
    </Form>
  );
}