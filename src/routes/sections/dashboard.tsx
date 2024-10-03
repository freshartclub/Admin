import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const AddArtistFormIndex = lazy(() => import('src/sections/artist/addArtist/index'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));
const AddDisiline = lazy(() => import('src/pages/dashboard/AddDisipline'));
const DisciplinList = lazy(() => import('src/pages/dashboard/DisciplineList'));
const AddStyle = lazy(() => import('src/pages/dashboard/AddStyle'));
const StyleList = lazy(() => import('src/pages/dashboard/StyleList'));
const AddTechnic = lazy(() => import('src/pages/dashboard/AddTechnic'));
const TechnicList = lazy(() => import('src/pages/dashboard/TechnicList'));
const AddTheme = lazy(() => import('src/pages/dashboard/AddTheme'));
const ThemeList = lazy(() => import('src/pages/dashboard/ThemeList'));
const AddMediaSupport = lazy(() => import('src/pages/dashboard/AddMediaSupport'));
const MediaSupportList = lazy(() => import('src/pages/dashboard/MediaSupportList'));
const AddCreadentialsArea = lazy(() => import('src/pages/dashboard/AddCreadentialsArea'));
const CreadentialsAreaList = lazy(() => import('src/pages/dashboard/CreadentialsAreaList'));
const AddArtwork = lazy(() => import('src/pages/dashboard/AddArtwok'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'artist',
        children: [
          // { element: <PageFour />, index: true },
          { path: 'add', element: <AddArtistFormIndex /> },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },

      {
        path: 'category',
        children: [
          {
            path: 'discipline',
            children: [
              { path: 'add', element: <AddDisiline /> },
              { path: 'list', element: <DisciplinList /> },
            ],
          },
          {
            path: 'style',
            children: [
              { path: 'add', element: <AddStyle /> },
              { path: 'list', element: <StyleList /> },
            ],
          },
          {
            path: 'technic',
            children: [
              { path: 'add', element: <AddTechnic /> },
              { path: 'list', element: <TechnicList /> },
            ],
          },
          {
            path: 'theme',
            children: [
              { path: 'add', element: <AddTheme /> },
              { path: 'list', element: <ThemeList /> },
            ],
          },
          {
            path: 'mediasupport',
            children: [
              { path: 'add', element: <AddMediaSupport /> },
              { path: 'list', element: <MediaSupportList /> },
            ],
          },
        ],
      },
      {
        path: 'creadentialsAndInsigniasArea',
        children: [
          { path: 'add', element: <AddCreadentialsArea /> },
          { path: 'list', element: <CreadentialsAreaList /> },
        ],
      },
      {
        path: 'artwork',
        children: [
          { path: 'addArtwork', element: <AddArtwork /> },
          { path: 'artworkList', element: <div>artworkList</div> },
        ],
      },
      {
        path: 'order',
        children: [
          { path: 'subscribe', element: <div>order Subscribe</div> },
          { path: 'purchese', element: <div>order purchese</div> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { path: 'list', element: <div>invoice List page</div> },
          { path: 'details', element: <div>invoice Details page</div> },
          { path: 'create', element: <div>invoice create page</div> },
          { path: 'edit', element: <div>invoice edit page</div> },
        ],
      },
      {
        path: 'user',
        children: [
          { path: 'Profile', element: <div>user profile page</div> },
          { path: 'cards', element: <div>user cards page</div> },
          { path: 'list', element: <div>user list page</div> },
          { path: 'create', element: <div>user creaet page</div> },
          { path: 'edit', element: <div>user edit page</div> },
          { path: 'account', element: <div>user account page</div> },
        ],
      },
      {
        path: 'circle',
        children: [
          { path: 'addcircle', element: <div>Add circle page</div> },
          { path: 'circlelist', element: <div> List of Circle page</div> },
        ],
      },

      { path: 'logistics', element: <div>This is Logistics page</div> },

      { path: 'couponandpromotions', element: <div>coupon and promotions</div> },

      { path: 'subscriptionplan', element: <div>subscription plan page</div> },

      { path: 'faq', element: <div>FAQ page</div> },

      { path: 'kbdatabase', element: <div> KB database page page</div> },

      {
        path: 'contentmanagement',
        children: [
          { path: 'list', element: <div>contentmanagement List page</div> },
          { path: 'details', element: <div>contentmanagement Details page</div> },
          { path: 'create', element: <div>contentmanagement create page</div> },
          { path: 'edit', element: <div>contentmanagement edit page</div> },
        ],
      },
      { path: 'marketingandcommunication', element: <div> marketingandcommunication page</div> },

      { path: 'insurance', element: <div> insurance page</div> },

      { path: 'mail', element: <div> mail page</div> },

      { path: 'helpandsupport', element: <div> helpandsupport page</div> },
    ],
  },
];
