import type { ArtistDetailType } from 'src/types/artist/ArtistDetailType';

import { useState, useLayoutEffect } from 'react';
import { Box, Tab, Button } from '@mui/material';
import useGetArtist from 'src/http/createArtist/useGetArtist';
import { CustomTabs } from 'src/components/custom-tabs';
import { LoadingScreen } from 'src/components/loading-screen';
import { Media } from './Media';
import { Invoice } from './Invoice';
import { Logistic } from './Logistics';
import { Highlights } from './Highlights';
import { AboutArtist } from './AboutArtist';
import { OtherDetails } from './OtherDetails';
import { GeneralInformation } from './GeneralInformation';
import { useSearchParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

function AddArtistIndex() {
  const [artistFormData, setArtistFormData] = useState<ArtistDetailType>();

  const { refetch } = useGetArtist();

  const id = useSearchParams().get('id');
  const [tabIndex, setTabIndex] = useState(0);

  const [tabState, setTabState] = useState([
    { value: 'generalInformation', label: 'General Information', isSaved: false },
    { value: 'cvAndHighlights', label: 'CV & Highlights', isSaved: false },
    { value: 'aboutArtist', label: 'About Artist', isSaved: false },
    { value: 'media', label: 'Media', isSaved: false },
    { value: 'invoiceAndCo', label: 'Invoice & Co.', isSaved: false },
    { value: 'logistics', label: 'Logistics', isSaved: false },
    { value: 'otherDetails', label: 'Other Details', isSaved: false },
  ]);

  useLayoutEffect(() => {
    if (id)
      refetch().then((data) => {
        const obj: ArtistDetailType = {};
        const newTabState = tabState.map((val, i) => {
          if (i < data.data.pageCount) val.isSaved = true;
          return val;
        });

        setTabState(newTabState);
        obj.residentialAddress = data.data.address?.residentialAddress;
        obj.country = data.data.address?.country;
        obj.zipCode = data.data.address?.zipCode;
        obj.city = data.data.address?.city;
        obj.state = data.data.address?.state;
        obj.discipline = data.data?.aboutArtist?.discipline;
        obj.documents = data.data?.documents;
        obj.link = data?.data?.links;
        obj.profileStatus = data.data.profileStatus;

        delete data.data.address;
        delete data.data.links;

        if (data.data.pageCount > 1) {
          obj.highlights = data.data.highlights.addHighlights;
          obj.cvData = data.data.highlights.cv;
          delete data.data.highlights;
        }

        if (data.data.pageCount > 2) {
          obj.about = data.data.aboutArtist.about;
          obj.insignia = data.data.insignia;
          obj.discipline = data.data.aboutArtist.discipline;
          delete data.data.aboutArtist;
        }

        if (data.data.pageCount > 3) {
          obj.profileImage = data.data.profile.mainImage;
          obj.additionalImage = data.data.profile.additionalImage;
          obj.inProcessImage = data.data.profile.inProcessImage;
          obj.mainVideo = data.data.profile.mainVideo;
          obj.additionalVideo = data.data.profile.additionalVideo;

          delete data.data.media;
        }

        if (data.data.pageCount > 4) {
          obj.taxNumber = data.data?.invoice?.taxNumber;
          obj.taxLegalName = data.data?.invoice?.taxLegalName;
          obj.taxAddress = data.data?.invoice?.taxAddress;
          obj.taxZipCode = data.data?.invoice?.taxZipCode;
          obj.taxCity = data.data?.invoice?.taxCity;
          obj.taxProvince = data.data?.invoice?.taxProvince;
          obj.taxCountry = data.data?.invoice?.taxCountry;
          obj.taxEmail = data.data?.invoice?.taxEmail;
          obj.taxPhone = data.data?.invoice?.taxPhone;
          obj.taxBankIBAN = data.data?.invoice?.taxBankIBAN;
          obj.taxBankName = data.data?.invoice?.taxBankName;
          obj.vatAmount = data.data?.invoice?.vatAmount;

          obj.CustomOrder = data.data?.commercilization?.customOrder;
          obj.artProvider = data.data?.commercilization?.artProvider;
          obj.scoreProfessional = data.data?.commercilization?.scoreProfessional;
          obj.scorePlatform = data.data?.commercilization?.scorePlatform;
          obj.artistLevel = data.data?.commercilization?.artistLevel;
          obj.PublishingCatalog = data.data?.commercilization?.publishingCatalog;
          obj.ArtistPlus = data.data?.commercilization?.artistPlus;
          obj.MinNumberOfArtwork = data.data?.commercilization?.minNumberOfArtwork;
          obj.MaxNumberOfArtwork = data.data?.commercilization?.maxNumberOfArtwork;

          delete data.data.invoice;
        }

        if (data.data.pageCount > 5) {
          obj.logName = data.data?.logistics?.logName;
          obj.logAddress = data.data?.logistics?.logAddress;
          obj.logZipCode = data.data?.logistics?.logZipCode;
          obj.logCity = data.data?.logistics?.logCity;
          obj.logProvince = data.data?.logistics?.logProvince;
          obj.logCountry = data.data?.logistics?.logCountry;
          obj.logEmail = data.data?.logistics?.logEmail;
          obj.logPhone = data.data?.logistics?.logPhone;
          obj.logNotes = data.data?.logistics?.logNotes;

          delete data.data.logistic;
        }

        if (data.data.pageCount > 6) {
          obj.documents = data.data?.documents;
          obj.intTags = data.data?.otherTags?.intTags;
          obj.extTags = data.data?.otherTags?.extTags;
          obj.lastRevalidationDate = data.data?.lastRevalidationDate;
          obj.nextRevalidationDate = data.data?.nextRevalidationDate;
          obj.managerName = data.data?.managerDetails?.managerName;
          obj.managerArtistEmail = data.data?.managerDetails?.managerEmail;
          obj.managerArtistPhone = data.data?.managerDetails?.managerPhone;
          obj.managerArtistGender = data.data?.managerDetails?.managerGender;
          obj.managerArtistContactTo = data.data?.managerDetails?.artistContactTo;
          obj.address = data.data?.managerDetails?.address?.address;
          obj.managerCity = data.data?.managerDetails?.address?.city;
          obj.managerState = data.data?.managerDetails?.address?.state;
          obj.managerZipCode = data.data?.managerDetails?.address?.zipCode;
          obj.managerCountry = data.data?.managerDetails?.address?.country;
          obj.extraInfo1 = data.data?.extraInfo?.extraInfo1;
          obj.extraInfo2 = data.data?.extraInfo?.extraInfo2;
          obj.extraInfo3 = data.data?.extraInfo?.extraInfo3;
          obj.emergencyContactName = data.data?.emergencyInfo?.emergencyContactName;
          obj.emergencyContactPhone = data.data?.emergencyInfo?.emergencyContactPhone;
          obj.emergencyContactEmail = data.data?.emergencyInfo?.emergencyContactEmail;
          obj.emergencyContactRelation = data.data?.emergencyInfo?.emergencyContactRelation;
          obj.emergencyContactAddress = data.data?.emergencyInfo?.emergencyContactAddress;
          obj.managerArtistLanguage = data.data?.managerDetails?.language;
        }

        setArtistFormData({ ...data.data, ...obj });
        if (data.data.pageCount === 7) {
          setTabIndex(0);
        } else {
          setTabIndex(data.data.pageCount);
        }
      });
  }, []);

  if (id && !artistFormData) return <LoadingScreen />;

  return (
    <Box sx={{ p: 1, position: 'relative' }}>
      <span
        className={`w-fit right-[1rem] z-10 fixed h-fit rounded-2xl text-[12px] px-2 py-1 ${artistFormData?.profileStatus === 'active' ? 'bg-[#E7F4EE] text-[#0D894F]' : artistFormData?.profileStatus === 'pending' ? 'bg-[#FFF2E7] text-[#f07b38]' : 'bg-[#FEEDEC] text-[#F04438]'}`}
      >
        {artistFormData?.profileStatus === 'active'
          ? 'Active'
          : artistFormData?.profileStatus === 'inactive'
            ? 'InActive'
            : 'Validation Pending'}
      </span>
      <CustomTabs className="custom12" variant="standard" sx={{ bgcolor: 'white' }}>
        {tabState.map((tab, i) => (
          <Tab
            disabled={i > 0 && tabState[i - 1].isSaved !== true}
            onClick={() => setTabIndex(i)}
            key={tab.value}
            value={tab.value}
            label={<Button variant={i === tabIndex ? 'contained' : 'outlined'}>{tab.label}</Button>}
          />
        ))}
      </CustomTabs>
      {tabIndex === 0 && (
        <Box sx={{ p: 1 }}>
          <GeneralInformation
            artistFormData={artistFormData}
            setArtistFormData={setArtistFormData}
            setTabState={setTabState}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            tabState={tabState}
          />
        </Box>
      )}
      {tabIndex === 1 && (
        <Box sx={{ p: 1 }}>
          <Highlights
            artistFormData={artistFormData}
            setArtistFormData={setArtistFormData}
            setTabState={setTabState}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            tabState={tabState}
          />
        </Box>
      )}
      {tabIndex === 2 && (
        <Box sx={{ p: 1 }}>
          <AboutArtist
            artistFormData={artistFormData}
            setArtistFormData={setArtistFormData}
            setTabState={setTabState}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            tabState={tabState}
          />
        </Box>
      )}
      {tabIndex === 3 && (
        <Box sx={{ p: 1 }}>
          <Media
            artistFormData={artistFormData}
            setArtistFormData={setArtistFormData}
            setTabState={setTabState}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            tabState={tabState}
          />
        </Box>
      )}
      {tabIndex === 4 && (
        <Box sx={{ p: 1 }}>
          <Invoice
            artistFormData={artistFormData}
            setArtistFormData={setArtistFormData}
            setTabState={setTabState}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            tabState={tabState}
          />
        </Box>
      )}
      {tabIndex === 5 && (
        <Box sx={{ p: 1 }}>
          <Logistic
            artistFormData={artistFormData}
            setArtistFormData={setArtistFormData}
            setTabState={setTabState}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            tabState={tabState}
          />
        </Box>
      )}
      {tabIndex === 6 && (
        <Box sx={{ p: 1 }}>
          <OtherDetails
            artistFormData={artistFormData}
            setArtistFormData={setArtistFormData}
            setTabState={setTabState}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            tabState={tabState}
          />
        </Box>
      )}
    </Box>
  );
}

export default AddArtistIndex;
