import type { IOrderTableFilters } from 'src/types/order';
import type { IDatePickerControl } from 'src/types/common';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Field } from 'src/components/hook-form';
import { Button, Checkbox, FormControl, InputLabel, OutlinedInput, Select } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';


// ----------------------------------------------------------------------

type Props = {
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
]
const status = ["Creatad",'Dispatched','Technical Finish','In progress','Finalise']
const weaks = ["1 day","2 day","3 day","4 day","5 day","6 day","7 day",]

export function TicketTableToolbar({ filters, onResetPage, dateError }: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ service: newValue });
    },
    [filters, onResetPage]
  );


  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: "fit-content" }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
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
            // multiple
            // value={filters.state.service}
            // onChange={handleFilterService}
            input={<OutlinedInput label="Status" />}
            // renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'Status' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {status.map((option) => (
              <MenuItem key={option} value={option}>
                {/* <Checkbox
                  disableRipple
                  size="small"
                  // checked={filters.state.service.includes(option)}
                /> */}
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
             <InputLabel htmlFor="ThisWeak">This Weak</InputLabel>

          <Select
            // multiple
            // value={filters.state.service}
            // onChange={handleFilterService}
            input={<OutlinedInput label="Status" />}
            // renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'ThisWeak' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {weaks.map((option) => (
              <MenuItem key={option} value={option}>
                {/* <Checkbox
                  disableRipple
                  size="small"
                  // checked={filters.state.service.includes(option)}
                /> */}
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
              sx={{py: 2, maxWidth: { md: 180 } }}
            >
              New Teckets
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.tickets.addIncident}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{py: 2, maxWidth: { md: 180 } }}
            >
              New Incident
            </Button>
      </Stack>
      
    </>
  );
}




