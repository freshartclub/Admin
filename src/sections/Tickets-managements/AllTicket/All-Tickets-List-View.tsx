import type { IOrderItem } from 'src/types/order';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { TICKET_OPTIONS } from 'src/_mock';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { varAlpha } from 'src/theme/styles';
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
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { useGetTicketListMutation } from '../http/useGetTicketListMutation';
import { TicketCartd } from './Card';
import { TicketTableToolbar } from './Tecket-table-toolbar';

export function TicketsListView() {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [days, setDays] = useState<string>('');

  const debounceSearch = useDebounce(search, 500);
  const { data, isLoading } = useGetTicketListMutation(debounceSearch, status, days);

  const [selectedTab, setSelectedTab] = useState('allTickets');
  const table = useTable();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState<IOrderItem[]>([]);

  useEffect(() => {
    if (data?.data) {
      setTableData(data?.data);
    }
  }, [data?.data]);

  const dataFiltered = applyFilter({
    inputData:
      selectedTab === 'Finalise'
        ? tableData.filter((item) => item.status === 'Finalise')
        : tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="Ticket List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Ticket List' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <TicketTableToolbar
        setSearch={setSearch}
        setStatus={setStatus}
        sStatus={status}
        setDays={setDays}
        days={days}
        onResetPage={table.onResetPage}
      />
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
            {TICKET_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="start"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label variant={(tab.value === selectedTab && 'filled') || 'soft'}>
                    {tab.value === 'Finalise'
                      ? tableData.filter((item) => item.status === 'Finalise').length
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
                  <TicketCartd key={row._id} url={data?.url} data={row} />
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
