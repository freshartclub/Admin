import type { ArtistDetailType } from 'src/types/artist/ArtistDetailType';

import { useState, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
import { log } from 'console';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function AddArtistIndex() {
  const [artistFormData, setArtistFormData] = useState<ArtistDetailType>();

  const [searchParam, setSearchParam] = useSearchParams();

  const { isFetching, isLoading, refetch, isFetched } = useGetArtist();

  const id = searchParam.get('id');
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
        obj.residentialAddress = data.data.address.residentialAddress;
        obj.country = data.data.address.country;
        obj.zipCode = data.data.address.zipCode;
        obj.city = data.data.address.city;
        obj.state = data.data.address.state;
        delete data.data.address;

        if (data.data.pageCount > 1) {
          obj.highlights = data.data.highlights.addHighlights;
          obj.cvData = data.data.highlights.cv;
          delete data.data.highlights;
        }

        if (data.data.pageCount > 2) {
          obj.about = data.data.aboutArtist.about;
          obj.artistCatagory = data.data.aboutArtist.category;
          delete data.data.aboutArtist;
        }

        // if (data.data.pageCount > 3) {
        //   obj.profileImage = data.data.profile.mainImage;
        //   obj.additionalImage = data.data.profile.additionalImage;
        //   obj.inProcessImage = data.data.profile.inProcessImage;

        //   obj.mainVideo = data.data.profile.mainVideo;

        //   obj.additionalVideo = data.data.profile.additionalVideo;

        //   delete data.data.media;
        // }

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
          delete data.data.invoice;
        }

        // check names

        console.log(data.data);

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
          obj.documentName = data.data?.document?.documentName;
          obj.uploadDocs = data.data?.document?.documentPath;
          obj.managerArtistName = data.data?.managerDetails?.artistName;
          obj.managerArtistSurnameOther1 = data.data?.managerDetails?.artistSurname1;
          obj.managerArtistSurname2 = data.data?.managerDetails?.artistSurname2;
          obj.managerArtistNickname = data.data?.managerDetails?.artistNickname;
          obj.managerArtistEmail = data.data?.managerDetails?.artistEmail;
          obj.managerArtistPhone = data.data?.managerDetails?.artistPhone;
          obj.managerArtistGender = data.data?.managerDetails?.artistGender;
          obj.managerArtistContactTo = data.data?.managerDetails?.artistContactTo;
          obj.address = data.data?.managerDetails?.address?.address;
          obj.managerCity = data.data?.managerDetails?.address?.city;
          obj.managerState = data.data?.managerDetails?.address?.state;
          obj.managerZipCode = data.data?.managerDetails?.address?.zipCode;
          obj.managerCountry = data.data?.managerDetails?.address?.country;
          obj.managerExtraInfo1 = data.data?.managerDetails?.address?.extraInfo1;
          obj.managerExtraInfo2 = data.data?.managerDetails?.address?.extraInfo2;
          obj.managerExtraInfo3 = data.data?.managerDetails?.address?.extraInfo3;

          obj.managerArtistLanguage = data.data?.managerDetails?.language;
        }

        setArtistFormData({ ...data.data, ...obj });
        if (data.data.pageCount === 7) {
          setTabIndex(0);
        } else {
          setTabIndex(data.data.pageCount);
        }
      });

    // if(data.data.pageCount > 3){
    //     obj.about = data.data.media.media;

    //     delete data.data.media;
    //   }
    //   setArtistFormData({ ...data.data, ...obj });
    //   setTabIndex(data.data.pageCount);
    // });

    // rember you should have to give dependency here and it is id
  }, []);

  if (id && !artistFormData) return <LoadingScreen />;

  return (
    <Box sx={{ p: 1 }}>
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
