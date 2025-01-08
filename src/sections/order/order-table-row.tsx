import type { IOrderItem } from 'src/types/order';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router';
import { currencies } from 'src/_mock/_currency';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: IOrderItem;
  url: string;
};

export function OrderTableRow({ row, url }: Props) {
  const collapse = useBoolean();
  const navigate = useNavigate();

  const currencySymbol = currencies.find(
    (item) => item.code === row?.items[0]?.artWork?.pricing?.currency?.split(' ')[0]
  )?.symbol;

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const renderPrimary = (
    <TableRow hover>
      <TableCell>
        <Link
          color="inherit"
          onClick={() =>
            navigate(paths.dashboard.order.details + `/${row?._id}?orderType=${row?.orderType}`)
          }
          underline="always"
          sx={{ cursor: 'pointer' }}
        >
          {row?.orderID}
        </Link>
      </TableCell>

      <TableCell>
        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Box component="span">{name(row?.user)}</Box>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row?.user?.email}
          </Box>
        </Stack>
      </TableCell>
      <TableCell align="center">{row?.items?.length}</TableCell>
      <TableCell> {currencySymbol + ' ' + row?.total} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'success' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            (row.status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {row?.status}
        </Label>
      </TableCell>
      <TableCell>{fDate(row?.createdAt)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <IconButton
          color="inherit"
          onClick={() =>
            navigate(`${paths.dashboard.order.details}/${row._id}?orderType=${row?.orderType}`)
          }
        >
          <Iconify icon="solar:eye-bold" />
        </IconButton>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.items.map((item, i) => (
              <Stack
                key={i}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }}
              >
                <Avatar
                  src={`${url}/users/${item?.artWork?.media}`}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item?.artWork?.artworkName}
                  secondary={item?.artWork?.artworkId}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{ component: 'span', color: 'text.disabled', mt: 0.5 }}
                />

                <div>x{item.quantity} </div>

                <Box sx={{ width: 110, textAlign: 'right' }}>
                  {currencySymbol + ' ' + item?.artWork?.pricing?.basePrice}
                </Box>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}
    </>
  );
}
