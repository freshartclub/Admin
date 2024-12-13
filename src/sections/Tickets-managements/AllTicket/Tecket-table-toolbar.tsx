import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { RenderAllPicklists } from 'src/sections/Picklists/RenderAllPicklist';

// ----------------------------------------------------------------------

type Props = {
  setSearch: (value: string) => void;
  setStatus: (value: string) => void;
  setFilter: (value: string) => void;
  setFilterOption: (value: string) => void;
  filterOption: string;
  filter: string;
  sStatus: string;
  setDays: (value: string) => void;
  days: string;
  onResetPage: () => void;
};

export function TicketTableToolbar({
  setSearch,
  setStatus,
  setFilter,
  setFilterOption,
  filterOption,
  filter,
  sStatus,
  setDays,
  days,
  onResetPage,
}: Props) {
  const [picklistArr, setPicklistArr] = useState([]);
  const weeks = ['All', '1 Day', '1 Week', '1 Month', '1 Quarter', '1 Year'];
  const filterBy = ['All', 'Ticket Urgency', 'Ticket Priority', 'Ticket Impact', 'Ticket Type'];

  const picklist = RenderAllPicklists([
    'Ticket Status',
    'Ticket Urgency',
    'Ticket Priority',
    'Ticket Impact',
    'Ticket Type',
  ]);

  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const statusPic = picklistMap['Ticket Status'];
  const urgency = picklistMap['Ticket Urgency'];
  const priority = picklistMap['Ticket Priority'];
  const impact = picklistMap['Ticket Impact'];
  const ticketType = picklistMap['Ticket Type'];

  useEffect(() => {
    if (filter === 'Ticket Urgency') {
      setPicklistArr(urgency);
    } else if (filter === 'Ticket Priority') {
      setPicklistArr(priority);
    } else if (filter === 'Ticket Impact') {
      setPicklistArr(impact);
    } else if (filter === 'Ticket Type') {
      setPicklistArr(ticketType);
    } else if (filter === 'All') {
      setFilterOption('');
    }
  }, [filter, setFilterOption]);

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
            <MenuItem value="All">All</MenuItem>
            {statusPic && statusPic.length > 0 ? (
              statusPic.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.value}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="All">No Data</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Creation Time Frame">Creation Time Frame</InputLabel>

          <Select
            input={<OutlinedInput label="Creation Time Frame" />}
            inputProps={{ id: 'Creation Time Frame' }}
            sx={{ textTransform: 'capitalize' }}
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            {weeks.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Filter By">Filter By</InputLabel>

          <Select
            input={<OutlinedInput label="Filter By" />}
            inputProps={{ id: 'Filter By' }}
            sx={{ textTransform: 'capitalize' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {filterBy.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {filter !== 'All' ? (
          <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
            <InputLabel htmlFor="Filter Options">Filter Options</InputLabel>

            <Select
              input={<OutlinedInput label="Filter Options" />}
              inputProps={{ id: 'Filter Options' }}
              sx={{ textTransform: 'capitalize' }}
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              {picklistArr && picklistArr.length > 0 ? (
                picklistArr.map((option: any, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="All">No Data</MenuItem>
              )}
            </Select>
          </FormControl>
        ) : null}

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
        </Box>
      </Stack>
    </>
  );
}
