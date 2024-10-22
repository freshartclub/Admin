import type { IOrderTableFilters } from 'src/types/order';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type Props = {
  setSearch: (value: string) => void;
  dateError: boolean;
  onResetPage: () => void;
  filters: UseSetStateReturn<IOrderTableFilters>;
};
const STATUS_OPTIONS = [
  { value: 'creatad', label: 'creatad' },
  { value: 'Dispatched', label: 'Dispatched' },
  { value: 'Technical Finish', label: 'Technical Finish' },
  { value: 'In progress', label: 'In progress' },
  { value: 'Finalise', label: 'Finalise' },
];

export function TicketTableToolbar({ setSearch, filters, onResetPage, dateError }: Props) {
  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            // value={search}
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

        <Button
          component={RouterLink}
          // href={paths.dashboard.invoice.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          // sx={{ maxWidth: { md: 180 } }}
        >
          New Ticket
        </Button>
        <Button
          component={RouterLink}
          // href={paths.dashboard.invoice.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          // sx={{ maxWidth: { md: 1800 } }}
        >
          New Incident
        </Button>
      </Stack>
    </>
  );
}
