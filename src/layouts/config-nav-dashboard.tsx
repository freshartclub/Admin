import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { title } from 'process';

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
        path: paths.dashboard.artist.five,
        icon: ICONS.paintBrush,
        children: [
          // { title: 'Add Artist', path: paths.dashboard.artist.addArtist },
          { title: 'Add Artist', path: paths.dashboard.artist.createArtist },

          { title: 'Artist List', path: paths.dashboard.artist.artistList },
          { title: 'Artist Request', path: paths.dashboard.artist.artistRequest },
          { title: 'Artist Pending Request', path: paths.dashboard.artist.artistPendingRequest },
        ],
      },
      {
        title: 'Artwork',
        path: paths.dashboard.artwork.Root,
        icon: ICONS.paintBrush,
        children: [
          { title: 'Add Artwork', path: paths.dashboard.artwork.addArtwork },
          { title: 'Artwork List', path: paths.dashboard.artwork.artworkList },
        ],
      },

      {
        title: 'Categorys',
        path: paths.dashboard.category.root,
        icon: ICONS.menuItem,
        children: [
          {
            title: 'Discipline',
            path: paths.dashboard.category.discipline.root,
            children: [
              {
                title: 'Add Discipline',
                path: paths.dashboard.category.discipline.add,
              },
              {
                title: 'Discipline List',
                path: paths.dashboard.category.discipline.list,
              },
            ],
          },
          {
            title: 'Style',
            path: paths.dashboard.category.style.root,
            children: [
              {
                title: 'Add Style',
                path: paths.dashboard.category.style.add,
              },
              {
                title: 'Style list',
                path: paths.dashboard.category.style.list,
              },
            ],
          },
          {
            title: 'Technic',
            path: paths.dashboard.category.technic.root,
            children: [
              {
                title: 'Add Technic',
                path: paths.dashboard.category.technic.add,
              },
              {
                title: 'Technic list',
                path: paths.dashboard.category.technic.list,
              },
            ],
          },
          {
            title: 'Theme',
            path: paths.dashboard.category.theme.root,
            children: [
              {
                title: 'Add Theme',
                path: paths.dashboard.category.theme.add,
              },
              {
                title: 'Theme list',
                path: paths.dashboard.category.theme.list,
              },
            ],
          },
          {
            title: 'Media Support',
            path: paths.dashboard.category.mediasupport.root,
            children: [
              {
                title: 'Add Media Support',
                path: paths.dashboard.category.mediasupport.add,
              },
              {
                title: 'Media Support list',
                path: paths.dashboard.category.mediasupport.list,
              },
            ],
          },
        ],
      },

      {
        title: 'Credentials and Insignias Area',
        path: paths.dashboard.creadentialsAndInsigniasArea.root,
        icon: ICONS.course,
        children: [
          {
            title: 'Add Credentials and Insignias Area',
            path: paths.dashboard.creadentialsAndInsigniasArea.add,
          },
          {
            title: 'Credentials and Insignias Area List',
            path: paths.dashboard.creadentialsAndInsigniasArea.list,
          },
        ],
      },

      // try start
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
          { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'List', path: paths.dashboard.user.list },
          { title: 'Create', path: paths.dashboard.user.create },
          { title: 'Edit', path: paths.dashboard.user.edit },
          { title: 'Account', path: paths.dashboard.user.account },
        ],
      },
      {
        title: 'Circle Managemant',
        path: paths.dashboard.circle.Root,
        icon: ICONS.user,
        children: [
          { title: 'addcircle', path: paths.dashboard.circle.addcircle },
          { title: 'circlelist', path: paths.dashboard.circle.circlelist },
        ],
      },
      { title: 'Logistics', path: paths.dashboard.logistics, icon: ICONS.file },

      {
        title: 'Coupon & Promotions',
        path: paths.dashboard.couponandpromotions,
        icon: ICONS.blank,
      },
      {
        title: 'Subscription Plan',
        path: paths.dashboard.subscriptionplan,
        icon: ICONS.blank,
      },
      {
        title: 'FAQ',
        path: paths.dashboard.faq,
        icon: ICONS.file,
      },
      {
        title: 'KB Database',
        path: paths.dashboard.kbdatabase,
        icon: ICONS.blog,
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
        title: 'Help & Support',
        path: paths.dashboard.helpandsupport,
        icon: ICONS.job,
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
