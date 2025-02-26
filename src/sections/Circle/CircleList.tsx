import type { IOrderItem } from 'src/types/order';

import { FormControl, InputAdornment, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import {
  getComparator,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { varAlpha } from 'src/theme/styles';
import { imgUrl } from 'src/utils/BaseUrls';
import { CircleCard } from './CircleCard';
import { useGetAllCircles } from './http/useGetAllCircles';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { OutlinedInput } from '@mui/material';
import { MenuItem } from '@mui/material';

export function CircleList() {
  const [search, setSearch] = useState<string>('');
  const [sort, setSortType] = useState<string>('none');

  const debounceSearch = useDebounce(search, 800);
  const { data, isLoading } = useGetAllCircles({ search: debounceSearch, sort });

  const [selectedTab, setSelectedTab] = useState('All');
  const table = useTable();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState<IOrderItem[]>([]);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData:
      selectedTab === 'Draft'
        ? tableData.filter((item) => item.status === 'Draft')
        : selectedTab === 'Published'
          ? tableData.filter((item) => item.status === 'Published')
          : tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const sortType = [
    {
      value: 'none',
      label: 'No Sort',
    },
    {
      value: 'post',
      label: 'Most Post',
    },
    {
      value: 'name',
      label: 'Circle Title',
    },
    {
      value: 'follower',
      label: 'Most Follower',
    },
    {
      value: 'view',
      label: 'Most Viewed',
    },
  ];

  return (
    <>
      <CustomBreadcrumbs
        heading="Circle List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Circle List' }]}
        sx={{ mb: 3 }}
      />
      <Stack
        direction={{ xs: 'column', md: 'row', lg: 'row' }}
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Circle Name/Categories"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Status">Status</InputLabel>

          <Select
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'Status' }}
            onChange={(e) => setSortType(e.target.value)}
            value={sort}
            sx={{ textTransform: 'capitalize' }}
          >
            {sortType.map((option, i) => (
              <MenuItem key={i} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <RouterLink className="md:w-[9rem] w-full" href={`${paths.dashboard.circle.add}`}>
          <span className="bg-black justify-center text-white rounded-md flex items-center px-2 py-3 gap-2 w-full text-nowrap">
            <Iconify icon="mingcute:add-line" /> Add Circle
          </span>
        </RouterLink>
      </Stack>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            sx={{
              px: 0.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {['All', 'Draft', 'Published'].map((tab) => (
              <Tab
                key={tab}
                iconPosition="start"
                value={tab}
                label={tab}
                icon={
                  <Label variant={(tab === selectedTab && 'filled') || 'soft'}>
                    {tab === 'Draft'
                      ? tableData.filter((item) => item.status === 'Draft').length
                      : tab === 'Published'
                        ? tableData.filter((item) => item.status === 'Published').length
                        : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <CircleCard key={row._id} url={imgUrl} data={row} />
                ))}
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
}

type ApplyFilterProps = {
  inputData: IOrderItem[];
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
