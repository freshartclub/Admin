import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  setSearch: (value: string) => void;
  setStatus: (value: string) => void;
  sStatus: string;
  setDays: (value: string) => void;
  days: string;
  onResetPage: () => void;
};

const status = ['All', 'Created', 'Dispatched', 'Technical Finish', 'In progress', 'Finalise'];
const weaks = ['All', '1 day', '2 day', '3 day', '4 day', '5 day', '6 day', '7 day'];

export function TicketTableToolbar({
  setSearch,
  setStatus,
  sStatus,
  setDays,
  days,
  onResetPage,
}: Props) {
  useEffect(() => {
    setStatus('All');
    setDays('All');
  }, []);
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mb: { xs: 2.5, md: 1 } }}
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
            placeholder="Search By Ticket Id..."
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
            onChange={(e) => setStatus(e.target.value)}
            value={sStatus}
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
          <InputLabel htmlFor="This Week">This Week</InputLabel>

          <Select
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'This Week' }}
            sx={{ textTransform: 'capitalize' }}
            value={days}
            onChange={(e) => setDays(e.target.value)}
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
        <Button
          component={RouterLink}
          href={paths.dashboard.tickets.addTicket}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ py: 2, maxWidth: { md: 180 } }}
        >
          Add Ticket
        </Button>
      </Stack>
    </>
  );
}
