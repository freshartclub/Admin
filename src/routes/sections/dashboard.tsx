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
const AddDisiline = lazy(() => import('src/pages/dashboard/AddDisipline'))
const DisciplinList = lazy(() => import('src/pages/dashboard/DisciplineList'))
const AddStyle = lazy(() => import('src/pages/dashboard/AddStyle'))
const StyleList = lazy(() => import('src/pages/dashboard/StyleList'))
const AddTechnic = lazy(() => import('src/pages/dashboard/AddTechnic'))
const TechnicList = lazy(() => import('src/pages/dashboard/TechnicList'))
const AddTheme = lazy(() => import('src/pages/dashboard/AddTheme'))
const ThemeList = lazy(() => import('src/pages/dashboard/ThemeList'))
const AddMediaSupport = lazy(() => import('src/pages/dashboard/AddMediaSupport'))
const MediaSupportList = lazy(() => import('src/pages/dashboard/MediaSupportList'))

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
              { path: 'list', element: <DisciplinList/> }, 
           ],
          },
          {
            path: 'style',
            children: [
              { path: 'add', element: <AddStyle /> },  
              { path: 'list', element: <StyleList/> },
           ],
          },
          {
            path: 'technic',
            children: [
              { path: 'add', element: <AddTechnic /> },  
              { path: 'list', element: <TechnicList/> },
           ],
          },
          {
            path: 'theme',
            children: [
              { path: 'add', element: <AddTheme /> },  
              { path: 'list', element: <ThemeList/> },
           ],
          },
          {
            path: 'mediasupport',
            children: [
              { path: 'add', element: <AddMediaSupport /> },  
              { path: 'list', element: <MediaSupportList/> },
           ],
          },
        ],
      }
    ],
  },
];
