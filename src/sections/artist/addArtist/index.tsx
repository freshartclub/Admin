import type { ArtistDetailType } from 'src/types/artist/ArtistDetailType';

import { useState } from 'react';

import { Box, Tab, Button } from '@mui/material';

import { CustomTabs } from 'src/components/custom-tabs';

import { Media } from './Media';
import { Invoice } from './Invoice';
import { Logistic } from './Logistics';
import { Highlights } from './Highlights';
import { AboutArtist } from './AboutArtist';
import { OtherDetails } from './OtherDetails';
import { GeneralInformation } from './GeneralInformation';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function AddArtistIndex() {
  const [artistFormData, setArtistFormData] = useState<ArtistDetailType>();

  console.log(artistFormData);

  const [tabState, setTabState] = useState([
    { value: 'generalInformation', label: 'General Information', isSaved: false },
    { value: 'cvAndHighlights', label: 'CV & Highlights', isSaved: false },
    { value: 'aboutArtist', label: 'About Artist', isSaved: false },
    { value: 'media', label: 'Media', isSaved: false },
    { value: 'invoiceAndCo', label: 'Invoice & Co.', isSaved: false },
    { value: 'logistics', label: 'Logistics', isSaved: false },
    { value: 'otherDetails', label: 'Other Details', isSaved: false },
  ]);

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ p: 1 }}>
      <CustomTabs variant="standard" sx={{ bgcolor: 'white' }}>
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
