import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { IconButtonProps } from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';

// import type { SingleFilePreviewProps } from '../types';

export function SingleFilePreview({ file }) {
  const fileName = typeof file === 'string' ? file : file.name;
  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', }}>
      <video
        controls
        src={previewUrl}
        style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover',  }}
      />
      <Typography variant="caption" noWrap>{fileName}</Typography>
    </Box>
  );
}

export function DeleteButton({ sx, ...other }: IconButtonProps) {
    return (
      <IconButton
        size="small"
        sx={{
          top: 16,
          right: 16,
          zIndex: 9,
          position: 'absolute',
          color: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.8),
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.72),
          '&:hover': { bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
          ...sx,
        }}
        {...other}
      >
        <Iconify icon="mingcute:close-line" width={18} />
      </IconButton>
    );
  }
