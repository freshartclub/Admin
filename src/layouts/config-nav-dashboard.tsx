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
  /**
   * Overview
   */
  {
    subheader: 'Fresh Art Admin',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      // { title: 'Artist', path: paths.dashboard.two, icon: ICONS.ecommerce },
      // { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Artist',
        path: paths.dashboard.artist.Root,
        icon: ICONS.paintBrush,
        children: [
          // { title: 'Add Artist', path: paths.dashboard.artist.addArtist },
          // { title: 'Add Artist', path: paths.dashboard.artist.createArtist },
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
        ],
      },

      {
        title: 'Credentials and Insignias',
        path: paths.dashboard.creadentialsAndInsigniasArea.list,
        icon: ICONS.course,
      },

      {
        title: 'Order',
        path: paths.dashboard.order.Root,
        icon: ICONS.order,
        children: [
          { title: 'Subsciption order', path: paths.dashboard.order.subscribe },
          { title: 'Purchase order', path: paths.dashboard.order.purchese },
        ],
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
        title: 'User',
        path: paths.dashboard.user.Root,
        icon: ICONS.user,
        children: [
          { title: 'Profile', path: paths.dashboard.user.profile },
          // { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'List', path: paths.dashboard.user.list },
          // { title: 'Create', path: paths.dashboard.user.create },
          // { title: 'Edit', path: paths.dashboard.user.edit },
          { title: 'Account', path: paths.dashboard.user.account },
        ],
      },
      // {
      //   title: 'Circle Managemant',
      //   path: paths.dashboard.circle.Root,
      //   icon: ICONS.user,
      //   children: [
      //     { title: 'addcircle', path: paths.dashboard.circle.addcircle },
      //     { title: 'circlelist', path: paths.dashboard.circle.circlelist },
      //     {title: 'circledetails', path:paths.dashboard.circle.demo.circledetails},
      //     {title: 'circleedit', path:paths.dashboard.circle.demo.circleedit},

      //   ],
      // },
      {
        title: 'Circle Managemant',
        path: paths.dashboard.circle.root,
        icon: ICONS.blog,
        children: [
          { title: 'List', path: paths.dashboard.circle.root },
          { title: 'Details', path: paths.dashboard.circle.demo.details },
          { title: 'Create', path: paths.dashboard.circle.new },
          { title: 'Edit', path: paths.dashboard.circle.demo.edit },
        ],
      },
      { title: 'Logistics', path: paths.dashboard.logistics, icon: ICONS.file },

      {
        title: 'Coupon & Promotions',
        path: paths.dashboard.couponandpromotions.Root,
        icon: ICONS.blank,
        children: [
          { title: 'Add Coupon', path: paths.dashboard.couponandpromotions.add },
          { title: 'List of Coupon', path: paths.dashboard.couponandpromotions.list },
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
        // title: 'Job',
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
      // try end
    ],
  },
];

// items: [
// {
//   title: 'User',
//   path: paths.dashboard.user.root,
//   icon: ICONS.user,
//   children: [
//     { title: 'Profile', path: paths.dashboard.user.root },
//     { title: 'Cards', path: paths.dashboard.user.cards },
//     { title: 'List', path: paths.dashboard.user.list },
//     { title: 'Create', path: paths.dashboard.user.new },
//     { title: 'Edit', path: paths.dashboard.user.demo.edit },
//     { title: 'Account', path: paths.dashboard.user.account },
//   ],
// },
