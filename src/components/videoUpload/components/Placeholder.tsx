import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

import videoIcon from 'src/assets/images/Clip path group.png'

// ----------------------------------------------------------------------

export function UploadPlaceholdervideo({ ...other }: BoxProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      {/* <UploadIllustration hideBackground sx={{ width: 200 }} /> */}
       <img src={videoIcon} alt='video Icon' className='w-[100px]' />
      
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>Drop or select file</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          Drop files here or click to
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            browse
          </Box>
          through your machine.
        </Box>
      </Stack>
    </Box>
  );
}
