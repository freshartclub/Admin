import type { IInvoice } from 'src/types/invoice';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  url: string;
  selected: boolean;
  onSelectRow: () => void;
  onViewRow: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
};

export function CatalogTableRow({
  row,
  url,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();
  const popover = usePopover();
  const navigate = useNavigate();

  const viewArtworkList = (val) => {
    if (!val || val.length === 0) return 'N/A';
    return val
      .map((item) => item.artworkName)
      .slice(0, 2)
      .join(', ');
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack spacing={2} direction="row" sx={{ whiteSpace: 'nowrap' }}>
            <Avatar alt={row?.catalogName} src={`${url}/users/${row?.catalogImg}`} />

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row?.catalogName}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={onViewRow}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >
                  {row?.catalogName}
                </Link>
              }
            />
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{viewArtworkList(row?.artworkList)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.subPlan ? row?.subPlan.join(', ') : 'N/A'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => navigate(`${paths.dashboard.artwork.catalog.add}?id=${row._id}`)}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
