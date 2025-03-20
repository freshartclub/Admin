import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useParams } from 'src/routes/hooks';
import { RenderAllPicklists } from '../Picklists/RenderAllPicklist';
import { useGetStyleListMutation } from '../StyleListCategory/http/useGetStyleListMutation';
import { useApproveArtworkChanges } from './http/useApproveArtworkChanges';
import { useGetReviewArtwork } from './http/useGetReviewArtwork';
import { imgUrl } from 'src/utils/BaseUrls';
import lang from '../artist/addArtist/lang.json';

// ----------------------------------------------------------------------

export function ArtworkRevies() {
  const [validateChange, setValidateChange] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);

  const id = useParams().id;
  const isReadOnly = true;

  const { data: styleData } = useGetStyleListMutation();

  const picklist = RenderAllPicklists(['Emotions', 'Colors']);

  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const emotions = picklistMap['Emotions'];
  const colors = picklistMap['Colors'];

  let StyleArr: any = [];
  const StyleOptions =
    styleData && styleData.length > 0
      ? styleData
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => {
            let localObj: any = {
              value: '',
              label: '',
              disciplineName: [],
            };

            localObj.value = item?.styleName;
            localObj.label = item?.styleName;
            localObj.disciplineName =
              item?.discipline &&
              item?.discipline.length > 0 &&
              item?.discipline.map((item: any) => item?.disciplineName);

            StyleArr.push(localObj);

            return StyleArr;
          })
      : [];

  const { data, isLoading } = useGetReviewArtwork(id);

  let imgArr: any = [];
  let videoArr: any = [];
  let updatedImgArr: any = [];
  let updatedVideoArr: any = [];

  if (id && data) {
    data?.media?.images &&
      data?.media?.images.length > 0 &&
      data?.media?.images.forEach((item: any, i) => imgArr.push(`${imgUrl}/users/${item}`));
    data?.media?.otherVideo &&
      data?.media?.otherVideo.length > 0 &&
      data?.media?.otherVideo.forEach((item: any, i) => videoArr.push(`${imgUrl}/videos/${item}`));
  }

  if (id && data?.reviewDetails) {
    data?.reviewDetails?.media?.images &&
      data?.reviewDetails?.media?.images.length > 0 &&
      data?.reviewDetails?.media?.images.forEach((item: any, i) =>
        updatedImgArr.push(`${imgUrl}/users/${item}`)
      );
    data?.reviewDetails?.media?.otherVideo &&
      data?.reviewDetails?.media?.otherVideo.length > 0 &&
      data?.reviewDetails?.media?.otherVideo.forEach((item: any, i) =>
        updatedVideoArr.push(`${imgUrl}/videos/${item}`)
      );
  }

  const defaultValues = useMemo(
    () => ({
      backImage: data?.media?.backImage || null,
      inProcessImage: data?.media?.inProcessImage || null,
      mainImage: data?.media?.mainImage || null,
      mainVideo: data?.media?.mainVideo || null,
      images: imgArr,
      otherVideo: videoArr,
      updatedBackImage: data?.reviewDetails?.media?.backImage || null,
      updatedInProcessImage: data?.reviewDetails?.media?.inProcessImage || null,
      updatedMainImage: data?.reviewDetails?.media?.mainImage || null,
      updatedMainVideo: data?.reviewDetails?.media?.mainVideo || null,
      updatedImages: updatedImgArr || [],
      updatedOtherVideo: updatedVideoArr || [],
      intTags: data?.tags?.intTags || [],
      extTags: data?.tags?.extTags || [],
      updatedIntTags: data?.reviewDetails?.tags?.intTags || [],
      updatedExtTags: data?.reviewDetails?.tags?.extTags || [],
      artworkStyle: data?.additionalInfo?.artworkStyle || [],
      emotions: data?.additionalInfo?.emotions || [],
      colors: data?.additionalInfo?.colors || [],
      updatedArtworkStyle: data?.reviewDetails?.additionalInfo?.artworkStyle || [],
      updatedEmotions: data?.reviewDetails?.additionalInfo?.emotions || [],
      updatedColors: data?.reviewDetails?.additionalInfo?.colors || [],
      note: '',
    }),
    [data]
  );

  const formProps = useForm({
    defaultValues,
  });

  const { reset } = formProps;
  const { mutate } = useApproveArtworkChanges();

  const handleApprove = (isApproved) => {
    const note = formProps.getValues('note');
    if (!note) return toast.error('Note is required');

    const language = data?.owner?.language || 'Spanish';
    const selectedLang = lang.find((item) => item.name === language);

    let bodyData = data?.reviewDetails;
    bodyData.isApproved = isApproved;
    bodyData.note = note;
    bodyData.lang = selectedLang?.code || 'ES';
    bodyData.id = id;

    if (isApproved) {
      setIsApproveLoading(true);
    } else {
      setIsRejectLoading(true);
    }

    mutate(bodyData, {
      onSettled: () => {
        setIsApproveLoading(false);
        setIsRejectLoading(false);
      },
    });
  };

  useEffect(() => {
    if (data) {
      reset({
        mainImage: data?.media?.mainImage ? `${imgUrl}/users/${data?.media?.mainImage}` : null,
        mainVideo: data?.media?.mainVideo ? `${imgUrl}/videos/${data?.media?.mainVideo}` : null,
        backImage: data?.media?.backImage ? `${imgUrl}/users/${data?.media?.backImage}` : null,
        inProcessImage: data?.media?.inProcessImage
          ? `${imgUrl}/users/${data?.media?.inProcessImage}`
          : null,
        images: imgArr,
        otherVideo: videoArr,
        updatedMainImage: data?.reviewDetails?.media?.mainImage
          ? `${imgUrl}/users/${data?.reviewDetails?.media?.mainImage}`
          : null,
        updatedMainVideo: data?.reviewDetails?.media?.mainVideo
          ? `${imgUrl}/videos/${data?.reviewDetails?.media?.mainVideo}`
          : null,
        updatedBackImage: data?.reviewDetails?.media?.backImage
          ? `${imgUrl}/users/${data?.reviewDetails?.media?.backImage}`
          : null,
        updatedInProcessImage: data?.reviewDetails?.media?.inProcessImage
          ? `${imgUrl}/users/${data?.reviewDetails?.media?.inProcessImage}`
          : null,
        updatedImages: updatedImgArr || [],
        updatedOtherVideo: updatedVideoArr || [],
        intTags: data?.tags?.intTags || [],
        extTags: data?.tags?.extTags || [],
        updatedIntTags: data?.reviewDetails?.tags?.intTags || [],
        updatedExtTags: data?.reviewDetails?.tags?.extTags || [],
        artworkStyle: data?.additionalInfo?.artworkStyle || [],
        emotions: data?.additionalInfo?.emotions || [],
        colors: data?.additionalInfo?.colors || [],
        updatedArtworkStyle: data?.reviewDetails?.additionalInfo?.artworkStyle || [],
        updatedEmotions: data?.reviewDetails?.additionalInfo?.emotions || [],
        updatedColors: data?.reviewDetails?.additionalInfo?.colors || [],
      });
    }
  }, [data]);

  const checkIsChanged = (input1, input2) => {
    if (input1 !== input2) {
      return true;
    } else {
      return false;
    }
  };

  const checkIsArrayChanged = (array1, array2) => {
    if (!data) return;
    if (!array1 || !array2) return true;
    if (array1.length !== array2.length) {
      return true;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return true;
      }
    }
    return false;
  };

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  if (isLoading) return <LoadingScreen />;

  const validateChangeDialogBox = (
    <Dialog
      sx={{ width: '100vw' }}
      open={validateChange}
      onClose={() => {
        setValidateChange(false);
      }}
    >
      <DialogTitle>
        Approve Changes - ({data?.artworkName} {`"${data?.artworkId}"`})
      </DialogTitle>
      <form>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Field.Text
            required
            multiline
            rows={4}
            name="note"
            placeholder="Some Note/Reason"
            label="Note"
          />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: 2 }}>
          <span
            onClick={() => handleApprove(true)}
            className={`${isApproveLoading ? 'pointer-events-none' : ''}text-white bg-black rounded-md px-3 py-2 cursor-pointer`}
          >
            {isApproveLoading ? 'Approving...' : 'Approve Changes'}
          </span>

          <span
            onClick={() => handleApprove(false)}
            className={`${isRejectLoading ? 'pointer-events-none' : ''} text-white bg-red-500 rounded-md px-3 py-2 cursor-pointer`}
          >
            {isRejectLoading ? 'Rejecting...' : 'Reject Changes'}
          </span>
        </DialogActions>
      </form>
    </Dialog>
  );

  const rendergeneralDetails = (
    <Card>
      <CardHeader title="General Informations" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={isReadOnly}
            value={data?.artworkName}
            required
            name="artworkName"
            label="Artwork Name"
          />
          <Field.Text
            disabled={isReadOnly}
            value={name(data?.owner) || 'N/A'}
            required
            name="ownerName"
            label="Owner Name"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.artworkCreationYear}
            required
            name="artworkCreationYear"
            label="Artwork Creation Year"
          />
          <Field.Text
            value={data?.artworkSeries}
            disabled={isReadOnly}
            name="artworkSeries"
            label="Artwork Series"
          />
          <Field.Text
            value={data?.isArtProvider ? 'Yes' : 'No'}
            disabled={isReadOnly}
            name="isArtProvider"
            label="Art Provider"
          />
          <Field.Text
            value={data?.isArtProvider ? data?.provideArtistName : 'N/A'}
            disabled={isReadOnly}
            name="provideArtistName"
            label="Art Provider Name"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.productDescription || 'N/A'}
            name="productDescription"
            multiline
            rows={4}
            label="Product Description"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={
              !checkIsChanged(data?.reviewDetails?.artworkName, data?.artworkName) && isReadOnly
            }
            value={data?.reviewDetails?.artworkName}
            required
            name="artworkName"
            label="Updated Artwork Name"
          />
          <Field.Text
            disabled={isReadOnly}
            value={name(data?.owner) || 'N/A'}
            required
            name="ownerName"
            label="Owner Name"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.artworkCreationYear,
                data?.artworkCreationYear
              ) && isReadOnly
            }
            required
            value={data?.reviewDetails?.artworkCreationYear}
            name="artworkCreationYear"
            label="Updated Artwork Creation Year"
          />
          <Field.Text
            disabled={
              !checkIsChanged(data?.reviewDetails?.artworkSeries, data?.artworkSeries) && isReadOnly
            }
            value={data?.reviewDetails?.artworkSeries}
            name="artworkSeries"
            label="Updated Artwork Series"
          />
          <Field.Text
            disabled={
              !checkIsChanged(data?.reviewDetails?.isArtProvider, data?.isArtProvider) && isReadOnly
            }
            value={data?.reviewDetails?.isArtProvider}
            InputLabelProps={{ shrink: true }}
            name="isArtProvider"
            label="Updated Art Provider"
          />
          <Field.Text
            value={
              data?.reviewDetails?.isArtProvider ? data?.reviewDetails?.provideArtistName : 'N/A'
            }
            disabled={
              !checkIsChanged(data?.reviewDetails?.provideArtistName, data?.provideArtistName) &&
              isReadOnly
            }
            name="provideArtistName"
            label="Updated Art Provider Name"
          />
          <Field.Text
            disabled={
              !checkIsChanged(data?.reviewDetails?.productDescription, data?.productDescription) &&
              isReadOnly
            }
            value={data?.reviewDetails?.productDescription || 'N/A'}
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            name="productDescription"
            label="Updated Product Description"
          />
        </Box>
      </Stack>
    </Card>
  );

  const additionalInfo = (
    <Card>
      <CardHeader title="Categorization" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={isReadOnly}
            value={data?.discipline?.artworkDiscipline}
            name="discipline"
            label="Artwork Discipline"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.artworkTechnic}
            name="artworkTechnic"
            label="Artwork Technic"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.artworkTheme}
            name="artworkTheme"
            label="Artwork Technic"
          />
          <Field.MultiSelect
            disabled={isReadOnly}
            value={data?.additionalInfo?.artworkStyle}
            name="artworkStyle"
            label="Artwork Style"
            options={StyleArr ? StyleArr : []}
          />
          <Field.MultiSelect
            disabled={isReadOnly}
            value={data?.additionalInfo?.emotions}
            name="emotions"
            label="Artwork Emotion"
            options={emotions ? emotions : []}
          />
          <Field.MultiSelect
            disabled={isReadOnly}
            value={data?.additionalInfo?.colors}
            name="colors"
            label="Artwork Color"
            options={colors ? colors : []}
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.offensive}
            name="offensive"
            label="Artwork Offensive"
          />
          <Field.Autocomplete
            disabled={isReadOnly}
            required
            name="intTags"
            label="Internal Tags"
            multiple
            freeSolo
            options={[]}
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
          <Field.Autocomplete
            disabled={isReadOnly}
            required
            name="extTags"
            label="External Tags"
            multiple
            freeSolo
            options={[]}
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
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.material}
            name="material"
            label="Artwork Material"
          />
          <Field.Text
            value={data?.additionalInfo.height}
            disabled={isReadOnly}
            name="height"
            label="Height (in cm)"
          />
          <Field.Text
            value={data?.additionalInfo.width}
            disabled={isReadOnly}
            name="width"
            label="Width (in cm)"
          />
          <Field.Text
            value={data?.additionalInfo.length}
            disabled={isReadOnly}
            name="lenght"
            label="Depth (in cm)"
          />
          <Field.Text
            value={data?.additionalInfo.weight}
            disabled={isReadOnly}
            name="weight"
            label="Weight (in kg)"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.hangingAvailable}
            name="hangingAvailable"
            label="Hanging Available"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.hangingDescription}
            name="hangingDescription"
            label="Hanging Description"
            multiline
            rows={4}
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.framed}
            name="framed"
            label="Framed"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.framedDescription}
            name="framedDescription"
            label="Framed Description"
            multiline
            rows={4}
          />
          <Field.Text
            value={data?.additionalInfo?.frameHeight}
            disabled={isReadOnly}
            name="framedHeight"
            label="Framed Height (in cm)"
          />
          <Field.Text
            value={data?.additionalInfo?.frameWidth}
            disabled={isReadOnly}
            name="framedWidth"
            label="Framed Width (in cm)"
          />
          <Field.Text
            value={data?.additionalInfo?.frameLength}
            disabled={isReadOnly}
            name="framedLenght"
            label="Framed Depth (in cm)"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.additionalInfo?.artworkOrientation}
            name="artworkOrientation"
            label="Artwork Orientation"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.exclusive == true ? 'Yes' : 'No'}
            name="exclusive"
            label="Exclusive"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.discipline?.artworkDiscipline,
                data?.discipline?.artworkDiscipline
              ) && isReadOnly
            }
            value={data?.reviewDetails?.discipline?.artworkDiscipline}
            required
            name="updateDiscipline"
            label="Updated Artwork Discipline"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.artworkTechnic,
                data?.additionalInfo?.artworkTechnic
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.artworkTechnic}
            required
            name="updateTechnic"
            label="Updated Artwork Technic"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.artworkTheme,
                data?.additionalInfo?.artworkTheme
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.artworkTheme}
            required
            name="updateTheme"
            label="Updated Artwork Theme"
          />
          <Field.MultiSelect
            disabled={
              !checkIsArrayChanged(
                data?.reviewDetails?.additionalInfo?.artworkStyle,
                data?.additionalInfo?.artworkStyle
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.artworkStyle}
            required
            name="updatedArtworkStyle"
            label="Updated Artwork Style"
            options={StyleArr ? StyleArr : []}
          />
          <Field.MultiSelect
            disabled={
              !checkIsArrayChanged(
                data?.reviewDetails?.additionalInfo?.emotions,
                data?.additionalInfo?.emotions
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.emotions}
            required
            name="updatedEmotions"
            label="Updated Artwork Emotion"
            options={emotions ? emotions : []}
          />
          <Field.MultiSelect
            disabled={
              !checkIsArrayChanged(
                data?.reviewDetails?.additionalInfo?.colors,
                data?.additionalInfo?.colors
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.colors}
            required
            name="updatedColors"
            label="Updated Artwork Color"
            options={colors ? colors : []}
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.offensive,
                data?.additionalInfo?.offensive
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.offensive}
            required
            name="updatedOffensive"
            label="Updated Offensive"
          />
          <Field.Autocomplete
            disabled={isReadOnly}
            required
            name="updatedIntTags"
            label="Internal Tags"
            multiple
            freeSolo
            options={[]}
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
          <Field.Autocomplete
            disabled={
              !checkIsArrayChanged(
                data?.reviewDetails?.additionalInfo?.extTags,
                data?.additionalInfo?.extTags
              ) && isReadOnly
            }
            className="pointer-events-none"
            required
            name="updatedExtTags"
            label="External Tags"
            multiple
            freeSolo
            options={[]}
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
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.material,
                data?.additionalInfo?.material
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.material}
            required
            name="updatematerial"
            label="Updated Artwork Material"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.height,
                data?.additionalInfo?.height
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.height}
            required
            name="updateheight"
            label="Updated Height (in cm)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.width,
                data?.additionalInfo?.width
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.width}
            required
            name="updatewidth"
            label="Updated Width (in cm)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.length,
                data?.additionalInfo?.length
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.length}
            required
            name="updatelength"
            label="Updated Depth (in cm)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.weight,
                data?.additionalInfo?.weight
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.weight}
            required
            name="updateweight"
            label="Updated Weight (in kg)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.hangingAvailable,
                data?.additionalInfo?.hangingAvailable
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.hangingAvailable}
            required
            name="updatehanging"
            label="Updated Hanging"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.hangingDescription,
                data?.additionalInfo?.hangingDescription
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.hangingDescription}
            required
            multiline
            rows={4}
            name="updateDescription"
            label="Updated Description"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.framed,
                data?.additionalInfo?.framed
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.framed}
            required
            name="updateframed"
            label="Updated Framed"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.framedDescription,
                data?.additionalInfo?.framedDescription
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.framedDescription}
            required
            multiline
            rows={4}
            name="updateDescription"
            label="Updated Description"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.frameHeight,
                data?.additionalInfo?.frameHeight
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.frameHeight}
            required
            name="updateHeight"
            label="Updated Framed Height (in cm)"
          />

          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.frameWidth,
                data?.additionalInfo?.frameWidth
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.frameWidth}
            required
            name="updateWidth"
            label="Updated Framed Width (in cm)"
          />

          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.frameLength,
                data?.additionalInfo?.frameLength
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.frameLength}
            required
            name="updateLength"
            label="Updated Framed Length (in cm)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.additionalInfo?.artworkOrientation,
                data?.additionalInfo?.artworkOrientation
              ) && isReadOnly
            }
            value={data?.reviewDetails?.additionalInfo?.artworkOrientation}
            required
            name="updateArtworkOrientation"
            label="Artwork Orientation"
          />
          <Field.Text
            disabled={
              !checkIsChanged(data?.reviewDetails?.exclusive, data?.exclusive) && isReadOnly
            }
            value={data?.reviewDetails?.exclusive == true ? 'Yes' : 'No'}
            required
            name="updateExclusive"
            label="Exclusive"
          />
        </Box>
      </Stack>
    </Card>
  );

  const commercilization = (
    <Card>
      <CardHeader title="Commercilization" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            label="Selected Method"
            name="activeTab"
            value={data?.commercialization?.activeTab}
            disabled={isReadOnly}
          />
          {data && data?.commercialization?.activeTab === 'subscription' ? (
            <>
              <Field.Text
                label="Subscription Catalog"
                name="subscriptionCatalog"
                value={data?.commercialization?.publishingCatalog?.catalogName}
                disabled={isReadOnly}
              />
              <Field.Text
                label="Purchase Option"
                name="options"
                value={data?.commercialization?.purchaseOption}
                disabled={isReadOnly}
              />
            </>
          ) : (
            <>
              <Field.Text
                label="Purchase Catalog"
                name="price"
                value={data?.commercialization?.publishingCatalog?.catalogName}
                disabled={isReadOnly}
              />
              <Field.Text
                name="purchaseType"
                label="Purchase Type"
                value={data?.commercialization?.purchaseType}
                disabled={isReadOnly}
              />
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            label="Selected Method"
            name="updatedActiveTab"
            value={data?.reviewDetails?.commercialization?.activeTab}
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.commercialization?.activeTab,
                data?.commercialization?.activeTab
              ) && isReadOnly
            }
          />
          {data && data?.reviewDetails?.commercialization?.activeTab === 'subscription' ? (
            <>
              <Field.Text
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.commercialization?.subscriptionCatalog,
                    data?.commercialization?.publishingCatalog?._id
                  ) && isReadOnly
                }
                label="Subscription Catalog"
                name="updatedSubscriptionCatalog"
                value={data?.catalogReviewInfo}
              />
              <Field.Text
                label="Purchase Option"
                name="updatedOptions"
                value={data?.reviewDetails?.commercialization?.purchaseOption}
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.commercialization?.purchaseOption,
                    data?.commercialization?.purchaseOption
                  ) && isReadOnly
                }
              />
            </>
          ) : (
            <>
              <Field.Text
                label="Purchase Catalog"
                name="updatedPrice"
                value={data?.catalogReviewInfo}
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.commercialization?.purchaseCatalog,
                    data?.commercialization?.publishingCatalog?._id
                  ) && isReadOnly
                }
              />
              <Field.Text
                name="updatedPurchaseType"
                label="Purchase Type"
                value={data?.reviewDetails?.commercialization?.purchaseType}
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.commercialization?.purchaseType,
                    data?.commercialization?.purchaseType
                  ) && isReadOnly
                }
              />
            </>
          )}
        </Box>
      </Stack>
    </Card>
  );

  const pricing = (
    <Card>
      <CardHeader title="Pricing" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            name="currency"
            label="Currency"
            value={data?.pricing?.currency}
            disabled={isReadOnly}
          />
          {data && data?.commercialization?.activeTab === 'subscription' ? (
            <>
              <Field.Text
                name="basePrice"
                label="Base Price"
                placeholder="Base Price"
                value={data?.pricing?.basePrice}
                disabled={isReadOnly}
              />
              <Field.Text
                name="dpersentage"
                label="Discount Percentage"
                placeholder="0.00%"
                type="number"
                disabled={isReadOnly}
                value={data?.pricing?.dpersentage}
              />
              <Field.Text
                type="number"
                value={data?.pricing?.vatAmount}
                disabled={isReadOnly}
                name="vatAmount"
                label="VAT Amount (%)"
              />
              <Field.Text
                name="artistFees"
                label="Artist Fees"
                placeholder="Artist Fees"
                value={data?.pricing?.artistFees}
                disabled={isReadOnly}
              />
            </>
          ) : (
            <>
              {data?.commercialization?.purchaseType === 'Price By Request' ||
              data?.commercialization?.purchaseType === 'Fixed Price' ||
              data?.commercialization?.purchaseType === 'Downward Offer' ? (
                <>
                  <Field.Text
                    name="basePrice"
                    label="Base Price"
                    placeholder="Base Price"
                    value={data?.pricing?.basePrice}
                    disabled={isReadOnly}
                  />
                  <Field.Text
                    name="dpersentage"
                    label="Discount Percentage"
                    placeholder="0.00%"
                    type="number"
                    value={data?.pricing?.dpersentage}
                    disabled={isReadOnly}
                  />
                </>
              ) : null}
              {data?.commercialization?.purchaseType === 'Downward Offer' ||
              data?.commercialization?.purchaseType === 'Upward Offer' ? (
                <Field.Text
                  value={data?.pricing?.acceptOfferPrice}
                  disabled={isReadOnly}
                  name="acceptOfferPrice"
                  label="Accept offer min. price"
                />
              ) : null}
              <Field.Text
                type="number"
                value={data?.pricing?.vatAmount}
                name="vatAmount"
                label="VAT Amount (%)"
                disabled={isReadOnly}
              />
              <Field.Text
                name="artistFees"
                label="Artist Fees (%)"
                placeholder="Artist Fees"
                value={data?.pricing?.artistFees}
                disabled={isReadOnly}
              />
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            name="currency"
            label="Currency"
            value={data?.reviewDetails?.pricing?.currency}
            disabled={
              !checkIsChanged(data?.reviewDetails?.pricing?.currency, data?.pricing?.currency) &&
              isReadOnly
            }
          />
          {data && data?.reviewDetails?.commercialization?.activeTab === 'subscription' ? (
            <>
              <Field.Text
                name="updatedBasePrice"
                label="Base Price"
                placeholder="Base Price"
                value={data?.reviewDetails?.pricing?.basePrice}
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.pricing?.basePrice,
                    data?.pricing?.basePrice
                  ) && isReadOnly
                }
              />
              <Field.Text
                name="updatedDpersentage"
                label="Discount Percentage"
                placeholder="0.00%"
                type="number"
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.pricing?.dpersentage,
                    data?.pricing?.dpersentage
                  ) && isReadOnly
                }
                value={data?.reviewDetails?.pricing?.dpersentage}
              />
              <Field.Text
                type="number"
                value={data?.reviewDetails?.pricing?.vatAmount}
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.pricing?.vatAmount,
                    data?.pricing?.vatAmount
                  ) && isReadOnly
                }
                name="updatedVatAmount"
                label="VAT Amount (%)"
              />
              <Field.Text
                name="updatedArtistFees"
                label="Artist Fees"
                placeholder="Artist Fees"
                value={data?.reviewDetails?.pricing?.artistFees}
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.pricing?.artistFees,
                    data?.pricing?.artistFees
                  ) && isReadOnly
                }
              />
            </>
          ) : (
            <>
              {data?.reviewDetails?.commercialization?.purchaseType === 'Price By Request' ||
              data?.reviewDetails?.commercialization?.purchaseType === 'Fixed Price' ||
              data?.reviewDetails?.commercialization?.purchaseType === 'Downward Offer' ? (
                <>
                  <Field.Text
                    name="updatedBasePrice"
                    label="Base Price"
                    placeholder="Base Price"
                    value={data?.reviewDetails?.pricing?.basePrice}
                    disabled={
                      !checkIsChanged(
                        data?.reviewDetails?.pricing?.basePrice,
                        data?.pricing?.basePrice
                      ) && isReadOnly
                    }
                  />
                  <Field.Text
                    name="updatedDpersentage"
                    label="Discount Percentage"
                    placeholder="0.00%"
                    type="number"
                    value={data?.reviewDetails?.pricing?.dpersentage}
                    disabled={
                      !checkIsChanged(
                        data?.reviewDetails?.pricing?.dpersentage,
                        data?.pricing?.dpersentage
                      ) && isReadOnly
                    }
                  />
                </>
              ) : null}
              {data?.reviewDetails?.commercialization?.purchaseType === 'Downward Offer' ||
              data?.reviewDetails?.commercialization?.purchaseType === 'Upward Offer' ? (
                <Field.Text
                  value={data?.reviewDetails?.pricing?.acceptOfferPrice}
                  disabled={
                    !checkIsChanged(
                      data?.reviewDetails?.pricing?.acceptOfferPrice,
                      data?.pricing?.acceptOfferPrice
                    ) && isReadOnly
                  }
                  name="updatedAcceptOfferPrice"
                  label="Accept offer min. price"
                />
              ) : null}
              <Field.Text
                type="number"
                value={data?.reviewDetails?.pricing?.vatAmount}
                name="updatedVatAmount"
                label="VAT Amount (%)"
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.pricing?.vatAmount,
                    data?.pricing?.vatAmount
                  ) && isReadOnly
                }
              />
              <Field.Text
                name="updatedArtistFees"
                label="Artist Fees (%)"
                placeholder="Artist Fees"
                value={data?.reviewDetails?.pricing?.artistFees}
                disabled={
                  !checkIsChanged(
                    data?.reviewDetails?.pricing?.artistFees,
                    data?.pricing?.artistFees
                  ) && isReadOnly
                }
              />
            </>
          )}
        </Box>
      </Stack>
    </Card>
  );

  const inventoryShipping = (
    <Card>
      <CardHeader title="Inventory & Shipping" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={isReadOnly}
            value={data?.inventoryShipping?.pCode}
            name="pCode"
            label="Product code"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.inventoryShipping?.location}
            name="location"
            label="Location"
          />
          <Field.Text
            disabled={isReadOnly}
            name="packageMaterial"
            label="Package Material"
            value={data?.inventoryShipping?.packageMaterial}
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.inventoryShipping?.packageHeight}
            name="packageHeight"
            label="Package Height (in cm)"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.inventoryShipping?.packageWidth}
            name="packageWidth"
            label="Package Width (in cm)"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.inventoryShipping?.packageLength}
            name="packageLength"
            label="Package Depth (in cm)"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.inventoryShipping?.packageWeight}
            name="packageWeight"
            label="Package Weight (in Kg)"
          />
          <Field.Checkbox
            disabled={isReadOnly}
            checked={data?.inventoryShipping?.comingSoon}
            name="comingSoon"
            label="Comming Soon"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.pCode,
                data?.inventoryShipping?.pCode
              ) && isReadOnly
            }
            value={data?.reviewDetails?.inventoryShipping?.pCode}
            name="updatedPCode"
            label="Product code"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.location,
                data?.inventoryShipping?.location
              ) && isReadOnly
            }
            value={data?.reviewDetails?.inventoryShipping?.location}
            name="updatedLocation"
            label="Location"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.packageMaterial,
                data?.inventoryShipping?.packageMaterial
              ) && isReadOnly
            }
            name="updatedPackageMaterial"
            label="Package Material"
            value={data?.reviewDetails?.inventoryShipping?.packageMaterial}
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.packageHeight,
                data?.inventoryShipping?.packageHeight
              ) && isReadOnly
            }
            value={data?.reviewDetails?.inventoryShipping?.packageHeight}
            name="updatedPackageHeight"
            label="Package Height (in cm)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.packageWidth,
                data?.inventoryShipping?.packageWidth
              ) && isReadOnly
            }
            value={data?.reviewDetails?.inventoryShipping?.packageWidth}
            name="updatedPackageWidth"
            label="Package Width (in cm)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.packageLength,
                data?.inventoryShipping?.packageLength
              ) && isReadOnly
            }
            value={data?.reviewDetails?.inventoryShipping?.packageLength}
            name="updatedPackageLength"
            label="Package Depth (in cm)"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.packageWeight,
                data?.inventoryShipping?.packageWeight
              ) && isReadOnly
            }
            value={data?.reviewDetails?.inventoryShipping?.packageWeight}
            name="updatedPackageWeight"
            label="Package Weight (in Kg)"
          />
          <Field.Checkbox
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.inventoryShipping?.comingSoon,
                data?.inventoryShipping?.comingSoon
              ) && isReadOnly
            }
            checked={data?.reviewDetails?.inventoryShipping?.comingSoon}
            name="updatedComingSoon"
            sx={{ PointerEvent: 'none' }}
            label="Coming Soon"
          />
        </Box>
      </Stack>
    </Card>
  );

  const restriction = (
    <Card>
      <CardHeader title="Restriction" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={isReadOnly}
            value={data?.restriction?.availableTo}
            name="availableTo"
            label="Available To"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.restriction?.discountAcceptation}
            name="discountAcceptation"
            label="Discount Acceptation"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.restriction?.availableTo,
                data?.restriction?.availableTo
              ) && isReadOnly
            }
            value={data?.reviewDetails?.restriction?.availableTo}
            name="updatedAvailableTo"
            label="Available To"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.restriction?.discountAcceptation,
                data?.restriction?.discountAcceptation
              ) && isReadOnly
            }
            value={data?.reviewDetails?.restriction?.discountAcceptation}
            name="updatedDiscountAcceptation"
            label="Discount Acceptation"
          />
        </Box>
      </Stack>
    </Card>
  );

  const Promotions = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Promotions" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} p={2} direction={'row'}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={isReadOnly}
            value={data?.promotions?.promotion || ''}
            name="promotion"
            label="Promotion"
          />
          <Field.Text
            disabled={isReadOnly}
            value={data?.promotions?.promotionScore || ''}
            name="promotionScore"
            label="Promotion Score"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.promotions?.promotion,
                data?.promotions?.promotion
              ) && isReadOnly
            }
            value={data?.reviewDetails?.promotions?.promotion || ''}
            name="updatedPromotion"
            label="Promotion"
          />
          <Field.Text
            disabled={
              !checkIsChanged(
                data?.reviewDetails?.promotions?.promotionScore,
                data?.promotions?.promotionScore
              ) && isReadOnly
            }
            value={data?.reviewDetails?.promotions?.promotionScore || ''}
            name="updatedPromotionScore"
            label="Promotion Score"
          />
        </Box>
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
            <Typography>Main Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="mainImage" />
          </div>
          <div>
            <Typography>Back Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="backImage" />
          </div>
          <div>
            <Typography>Inprocess Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="inProcessImage" />
          </div>
          <div>
            <Typography>Additional Image</Typography>
            <Field.Upload multiple disabled={isReadOnly} thumbnail name="images" />
          </div>
          <div>
            <Typography>Main Video</Typography>
            <Field.MultiVideo disabled={isReadOnly} name="mainVideo" />
          </div>
          <div>
            <Typography>Other Video</Typography>
            <Field.MultiVideo
              disabled={isReadOnly}
              thumbnail
              accept="video/*"
              multiple
              name="otherVideo"
            />
          </div>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} gap={2}>
          <div>
            <Typography>Updated Main Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="updatedMainImage" />
          </div>
          <div>
            <Typography>Updated Back Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="updatedBackImage" />
          </div>
          <div>
            <Typography>Updated Inprocess Photo</Typography>
            <Field.Upload disabled={isReadOnly} name="updatedInProcessImage" />
          </div>
          <div>
            <Typography>Updated Additional Image</Typography>
            <Field.Upload multiple disabled={isReadOnly} thumbnail name="updatedImages" />
          </div>
          <div>
            <Typography>Updated Main Video</Typography>
            <Field.MultiVideo disabled={isReadOnly} name="updatedMainVideo" />
          </div>
          <div>
            <Typography>Updated Other Video</Typography>
            <Field.MultiVideo
              disabled={isReadOnly}
              thumbnail
              accept="video/*"
              multiple
              name="updatedOtherVideo"
            />
          </div>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <Form methods={formProps}>
      <Stack spacing={3}>
        {rendergeneralDetails}
        {renderProfile}
        {additionalInfo}
        {commercilization}
        {pricing}
        {inventoryShipping}
        {restriction}
        {Promotions}

        <div className="flex gap-2 justify-end">
          <span
            onClick={() => setValidateChange(true)}
            className="text-white bg-black rounded-md px-3 py-2 cursor-pointer"
          >
            Approve Changes
          </span>
        </div>
      </Stack>
      {validateChangeDialogBox}
    </Form>
  );
}
