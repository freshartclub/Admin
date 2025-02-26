import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  paintBrush: icon('ic-paint-brush'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Fresh Art Admin',
    items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Artist',
        path: paths.dashboard.artist.Root,
        icon: ICONS.paintBrush,
        children: [
          { title: 'New Artist Request', path: paths.dashboard.artist.artistRequest },
          { title: 'All Artist', path: paths.dashboard.artist.allArtist },
          { title: 'Active Artist', path: paths.dashboard.artist.artistList },
          { title: 'Unpublished Artists', path: paths.dashboard.artist.artistPendingRequest },
          { title: 'Suspended Artist', path: paths.dashboard.artist.suspendList },
        ],
      },
      {
        title: 'Artwork',
        path: paths.dashboard.artwork.Root,
        icon: ICONS.paintBrush,
        children: [
          {
            title: 'Catalog',
            path: paths.dashboard.artwork.catalog.root,
            children: [
              {
                title: 'Add Catalog',
                path: paths.dashboard.artwork.catalog.add,
              },
              {
                title: 'Catalog List',
                path: paths.dashboard.artwork.catalog.list,
              },
            ],
          },
          {
            title: 'Collection Management',
            path: paths.dashboard.artwork.collection_management.root,
            children: [
              {
                title: 'Add Collection',
                path: paths.dashboard.artwork.collection_management.add,
              },
              {
                title: 'Collection List',
                path: paths.dashboard.artwork.collection_management.list,
              },
            ],
          },
          { title: 'Add Artwork', path: paths.dashboard.artwork.addArtwork },
          { title: 'Artwork List', path: paths.dashboard.artwork.artworkList },
        ],
      },
      {
        title: 'Customise',
        path: paths.dashboard.customise.Root,
        icon: ICONS.folder,
        children: [
          {
            title: 'Translation File',
            path: paths.dashboard.customise.file.add,
          },
          {
            title: 'Home Artwork',
            path: paths.dashboard.customise.homeArtwork.root,
            children: [
              {
                title: 'Add Home Artwork',
                path: paths.dashboard.customise.homeArtwork.add,
              },
              {
                title: 'Home Artwork List',
                path: paths.dashboard.customise.homeArtwork.list,
              },
            ],
          },
          {
            title: 'Carousel',
            path: paths.dashboard.customise.carousel.list,
            children: [
              {
                title: 'Add Carousel',
                path: paths.dashboard.customise.carousel.add,
              },
              {
                title: 'Carousel List',
                path: paths.dashboard.customise.carousel.list,
              },
            ],
          },
        ],
      },
      {
        title: 'Categories',
        path: paths.dashboard.category.root,
        icon: ICONS.menuItem,
        children: [
          {
            title: 'Discipline',
            path: paths.dashboard.category.discipline.list,
          },
          {
            title: 'Style',
            path: paths.dashboard.category.style.list,
          },
          {
            title: 'Technic',
            path: paths.dashboard.category.technic.list,
          },
          {
            title: 'Theme',
            path: paths.dashboard.category.theme.list,
          },
          {
            title: 'Media Support',
            path: paths.dashboard.category.mediasupport.list,
          },
          {
            title: 'Picklist',
            path: paths.dashboard.category.picklist.list,
          },
          {
            title: 'Email Settings',
            path: paths.dashboard.category.email.list,
          },
        ],
      },
      {
        title: 'Credentials and Insignias',
        path: paths.dashboard.creadentialsAndInsigniasArea.list,
        icon: ICONS.course,
      },
      {
        title: 'All Orders',
        path: paths.dashboard.order.list,
        icon: ICONS.order,
      },
      {
        title: 'Invoice',
        path: paths.dashboard.invoice.Root,
        icon: ICONS.invoice,
        children: [
          { title: 'List', path: paths.dashboard.invoice.list },
          { title: 'Details', path: paths.dashboard.invoice.details },
          { title: 'Create', path: paths.dashboard.invoice.create },
          { title: 'Edit', path: paths.dashboard.invoice.edit },
        ],
      },
      {
        title: 'All User',
        path: paths.dashboard.user.list,
        icon: ICONS.user,
      },
      {
        title: 'Circle Managemant',
        path: paths.dashboard.circle.root,
        icon: ICONS.blog,
        children: [
          { title: 'Circle List', path: paths.dashboard.circle.list },
          { title: 'Add Circle', path: paths.dashboard.circle.add },
        ],
      },
      // { title: 'Logistics', path: paths.dashboard.logistics, icon: ICONS.file },

      {
        title: 'Coupon & Promotions',
        path: paths.dashboard.couponandpromotions.Root,
        icon: ICONS.blank,
        children: [
          { title: 'Add Coupon', path: paths.dashboard.couponandpromotions.add },
          { title: 'Coupon List', path: paths.dashboard.couponandpromotions.list },
        ],
      },
      {
        title: 'Subscription Plan',
        path: paths.dashboard.subscriptionplan.Root,
        icon: ICONS.blank,
        children: [
          { title: 'Add Plan', path: paths.dashboard.subscriptionplan.add },
          { title: 'Plan List', path: paths.dashboard.subscriptionplan.list },
        ],
      },
      {
        title: 'FAQ',
        path: paths.dashboard.faq.Root,
        icon: ICONS.file,
        children: [
          { title: 'Add FAQ', path: paths.dashboard.faq.add },
          { title: 'FAQ List', path: paths.dashboard.faq.list },
        ],
      },
      {
        title: 'KB Database',
        path: paths.dashboard.kbdatabase.Root,
        icon: ICONS.blog,
        children: [
          { title: 'Add KB', path: paths.dashboard.kbdatabase.add },
          { title: 'KB List', path: paths.dashboard.kbdatabase.list },
        ],
      },

      {
        title: 'Content Management',
        path: paths.dashboard.contentmanagement.Root,
        icon: ICONS.job,
        children: [
          { title: 'List', path: paths.dashboard.contentmanagement.list },
          { title: 'Details', path: paths.dashboard.contentmanagement.details },
          { title: 'Create', path: paths.dashboard.contentmanagement.create },
          { title: 'Edit', path: paths.dashboard.contentmanagement.edit },
        ],
      },
      {
        title: 'Marketing And Communication',
        path: paths.dashboard.marketingandcommunication,
        icon: ICONS.order,
      },
      {
        title: 'Insurance',
        path: paths.dashboard.insurance,
        icon: ICONS.banking,
      },

      {
        title: 'Mail',
        path: paths.dashboard.mail,
        icon: ICONS.mail,
        info: <label color="error">+32</label>,
      },
      {
        title: 'Ticket Management',
        path: paths.dashboard.tickets.Root,
        icon: ICONS.job,
        children: [
          { title: 'All Ticket List', path: paths.dashboard.tickets.allList },
          { title: 'All Incident List', path: paths.dashboard.tickets.allIncident },
          { title: 'Add Ticket', path: paths.dashboard.tickets.addTicket },
          { title: 'Add Incident', path: paths.dashboard.tickets.addIncident },
        ],
      },
      {
        title: 'Message And Notification',
        path: paths.dashboard.notificationAndMessage.Root,
        icon: ICONS.mail,
        children: [
          { title: 'Add Message', path: paths.dashboard.notificationAndMessage.addMessage },
          {
            title: 'Add Notification',
            path: paths.dashboard.notificationAndMessage.addNotification,
          },
          { title: 'List', path: paths.dashboard.notificationAndMessage.List },
        ],
      },
    ],
  },
];
