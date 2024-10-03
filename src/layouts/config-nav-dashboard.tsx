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
      { title: 'Artist', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
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
        children: [{ title: 'Add Artist', path: paths.dashboard.artist.addArtist }],
      },
      
      // {
      //   title: 'Category',
      //   path: paths.dashboard.category.root,
      //   icon: ICONS.menuItem,
      //   children: [
      //     {
      //       title: 'Disciline',
      //       path: paths.dashboard.category.discipline.root,
      //       children: [
      //         {
      //           title: 'Add Discipline',
      //           path: paths.dashboard.category.discipline.add.root,
      //         },
      //         {
      //           title: 'Discipline List',
      //           path: paths.dashboard.category.discipline.list,
      //         },
      //       ],
      //     },
      //   ],
      // },

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
      
    ],
    
  },
];


// items: [
//   {
//     title: 'User',
//     path: paths.dashboard.user.root,
//     icon: ICONS.user,
//     children: [
//       { title: 'Profile', path: paths.dashboard.user.root },
//       { title: 'Cards', path: paths.dashboard.user.cards },
//       { title: 'List', path: paths.dashboard.user.list },
//       { title: 'Create', path: paths.dashboard.user.new },
//       { title: 'Edit', path: paths.dashboard.user.demo.edit },
//       { title: 'Account', path: paths.dashboard.user.account },
//     ],
//   },