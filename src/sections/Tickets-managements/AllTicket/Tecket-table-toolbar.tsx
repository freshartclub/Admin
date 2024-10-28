import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  setSearch: (value: string) => void;
  onResetPage: () => void;
};

const status = ['Creatad', 'Dispatched', 'Technical Finish', 'In progress', 'Finalise'];
const weaks = ['1 day', '2 day', '3 day', '4 day', '5 day', '6 day', '7 day'];

export function TicketTableToolbar({ setSearch, onResetPage }: Props) {
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 'fit-content' }}
        >
          <TextField
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Tickets..."
            sx={{ maxWidth: { md: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Status">Status</InputLabel>

          <Select
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'Status' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {status.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="ThisWeak">This Weak</InputLabel>

          <Select
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'ThisWeak' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {weaks.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          component={RouterLink}
          href={paths.dashboard.tickets.addIncident}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ py: 2, maxWidth: { md: 180 } }}
        >
          New Incident
        </Button>
      </Stack>
    </>
  );
}
