import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { fData } from 'src/utils/format-number';
import { varAlpha } from 'src/theme/styles';
import { Iconify } from '../../iconify';

export function MultiFilePreviewVideo({ sx, onRemove, files = [] }) {
  return (
    <Box
      component="ul"
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {files.map((file) => {
        const fileName = file.name;
        const fileSize = fData(file.size);
        const previewUrl = URL.createObjectURL(file);

        return (
          <Box
            component="li"
            key={fileName}
            sx={{
              py: 1,
              pr: 1,
              pl: 1.5,
              gap: 1.5,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            <video
              controls
              src={previewUrl}
              style={{
                width: 80,
                height: 'auto',
                borderRadius: '4px',
                objectFit: 'cover',
              }}
            />

            <ListItemText
              primary={fileName}
              secondary={fileSize}
              secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
