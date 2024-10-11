import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { CustomTabs } from 'src/components/custom-tabs';
import { NotificationItem } from './notification-item';
import { MessageItem } from './message-item';

import type { NotificationItemProps } from './notification-item';

import { _messages, _notifications } from 'src/_mock';
import { Button } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'Notification', label: 'Notification', count: 22 },
  { value: 'Message', label: 'Message', count: 12 },
];


// ----------------------------------------------------------------------

export type NotificationsDrawerProps = {
  data?: NotificationItemProps[];
};

export function NotificationsAndMessage({ data = [] }: NotificationsDrawerProps) {
  const [currentTab, setCurrentTab] = useState('Notification');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      
    </Stack>
  );

  const renderTabs = (
    <CustomTabs variant="fullWidth" value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'Notification' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'Message' && 'info') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
        />
      ))}
    </CustomTabs>
  );

  const renderList = (
    <Box component="ul">
      {_notifications?.map((notification) => (
        <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
          <NotificationItem notification={notification} />
        </Box>
      ))}
    </Box>
  );
  const renderMessageList = (
    <Box component="ul">
      {_messages?.map((notification) => (
        <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
          <MessageItem notification={notification} />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <CustomBreadcrumbs
          heading="Notification And Message"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Notification And Message', href: paths.dashboard.notificationAndMessage.List},
           
          ]}
          action={
              currentTab === "Notification" ? (
                <Button
                component={RouterLink}
                href={paths.dashboard.notificationAndMessage.addNotification}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add Notification
              </Button>
              ) : (
                <Button
                component={RouterLink}
                href={paths.dashboard.notificationAndMessage.addMessage}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add Message
              </Button>
              )
          }
          
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      {/* {renderHead} */}
      {renderTabs}
      
      {
        currentTab === "Notification" && renderList
      }
      {
        currentTab === "Message" && renderMessageList
      }
      
    </Box>
  );
}
