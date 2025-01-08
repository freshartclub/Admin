import type { IOrderProductItem } from 'src/types/order';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Text from '@mui/material/Typography';
import { currencies } from 'src/_mock/_currency';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  taxes?: number;
  shipping?: number;
  discount?: number;
  subtotal?: number;
  totalAmount?: number;
  currency?: string;
  url: string;
  items?: IOrderProductItem[];
};

export function OrderDetailsItems({
  taxes,
  shipping,
  discount,
  subtotal,
  url,
  items = [],
  totalAmount,
}: Props) {
  const currencySymbol = currencies.find(
    (item) => item.code === items[0]?.artWork?.pricing?.currency?.split(' ')[0]
  )?.symbol;

  const renderTotal = (
    <Stack spacing={2} alignItems="flex-end" sx={{ p: 3, textAlign: 'right', typography: 'body2' }}>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>
          {currencySymbol + ' ' + subtotal || '0'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
        <Box sx={{ width: 160, ...(shipping && { color: 'error.main' }) }}>
          {shipping ? currencySymbol + ' ' + shipping : '0'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box sx={{ width: 160, ...(discount && { color: 'error.main' }) }}>
          {discount ? currencySymbol + ' ' + discount : '0'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{taxes ? taxes + '%' : '0'}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div>Total</div>
        <Box sx={{ width: 160 }}>{currencySymbol + ' ' + totalAmount}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title="Artwork Details" />

      <Scrollbar>
        {items.map((item, i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            sx={{
              p: 3,
              minWidth: 640,
              borderBottom: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
            }}
          >
            <Avatar
              src={`${url}/users/${item?.artWork?.media}`}
              variant="rounded"
              sx={{ width: 48, height: 48, mr: 2 }}
            />

            <ListItemText
              primary={item?.artWork.artworkName}
              secondary={item?.artWork?.artworkId}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{ component: 'span', color: 'text.disabled', mt: 0.5 }}
            />

            <Box
              sx={{
                typography: 'body2',
                width: 110,
                textAlign: 'left',
              }}
            >
              <Text
                sx={{
                  width: 'fit-content',
                  padding: '3px 5px',
                  borderRadius: '5px',
                  color: 'error.main',
                  fontSize: 12,
                  backgroundColor: 'rgba(255, 0, 0, 0.05)',
                }}
              >
                {item?.isCancelled && 'Cancelled'}
              </Text>
            </Box>
            <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>

            <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
              {currencySymbol + ' ' + item?.artWork.pricing?.basePrice}
            </Box>
          </Stack>
        ))}
      </Scrollbar>

      {renderTotal}
    </Card>
  );
}
