import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

const AddArtistForm = () => {
  const [searchParam, setSearchParam] = useSearchParams();

  const tabsData = [
    'General Information',
    'CV & Highlights',
    'About Artist',
    'Media',
    'Invoice & Co.',
    'Logistics',
    'Other Details',
  ];

  return (
    <div>
      <DashboardContent maxWidth="xl">
        <Typography variant="h4"> Add Artist </Typography>
      </DashboardContent>
    </div>
  );
};

export default AddArtistForm;
