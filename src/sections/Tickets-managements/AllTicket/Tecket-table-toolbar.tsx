import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
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

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
          <TextField
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Ticket Id..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <RouterLink href={`${paths.dashboard.tickets.addIncident}`}>
            <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[9rem]">
              <Iconify icon="mingcute:add-line" /> Add Incident
            </span>
          </RouterLink>
          <RouterLink href={`${paths.dashboard.tickets.addTicket}`}>
            <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[8rem]">
              <Iconify icon="mingcute:add-line" /> Add Ticket
            </span>
          </RouterLink>
        </Box>
      </Stack>
    </>
  );
}
