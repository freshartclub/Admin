import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/Dashboard'));
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
const UserAccount = lazy(() => import('src/pages/dashboard/user/account'));
const UserList = lazy(() => import('src/pages/dashboard/user/list'));
const UserProfile = lazy(() => import('src/pages/dashboard/user/profile'));
const InvoiceList = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetails = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceEdit = lazy(() => import('src/pages/dashboard/invoice/edit'));
const InvoiceNew = lazy(() => import('src/pages/dashboard/invoice/new'));
const OrderList = lazy(() => import('src/pages/dashboard/order/subscriptionlist'));
const OrderPurcheseList = lazy(() => import('src/pages/dashboard/order/purcheseList'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
const ArtistList = lazy(() => import('src/pages/dashboard/Artist/ArtistList'));
const ArtistRequest = lazy(() => import('src/pages/dashboard/Artist/ArtistRequest'));
const ArtistPendingRequest = lazy(() => import('src/pages/dashboard/Artist/AartistPendingRequest'));
const CreateArtist = lazy(() => import('src/pages/dashboard/Artist/CreateArtist'));
const AddCircle = lazy(() => import('src/pages/dashboard/Circle/new'));
const CircleList = lazy(() => import('src/pages/dashboard/Circle/list'));
const CircleDetails = lazy(() => import('src/pages/dashboard/Circle/details'));
const CircleEdit = lazy(() => import('src/pages/dashboard/Circle/edit'));
const CreateContent = lazy(() => import('src/pages/dashboard/Content-Management/CreateContent'));
const ContentList = lazy(() => import('src/pages/dashboard/Content-Management/ContentList'));
const Mail = lazy(() => import('src/pages/dashboard/Mail'));
const AddFaq = lazy(() => import('src/pages/dashboard/FAQ/AddFaq'));
const FaqList = lazy(() => import('src/pages/dashboard/FAQ/FaqList'));
const AddKB = lazy(() => import('src/pages/dashboard/KBdatabase/AddKb'));
const KBList = lazy(() => import('src/pages/dashboard/KBdatabase/KbList'));
const AddCoupon = lazy(() => import('src/pages/dashboard/Coupon-and-Promotion/AddCoupon'));
const ListOfCoupon = lazy(() => import('src/pages/dashboard/Coupon-and-Promotion/CouponList'));
const AddPlan = lazy(() => import('src/pages/dashboard/Subscription-plan/AddSubscription'));
const PlanList = lazy(() => import('src/pages/dashboard/Subscription-plan/PlanList'));
const Payment = lazy(() => import('src/pages/dashboard/Subscription-plan/Payment'));
const AddMassage = lazy(() => import('src/pages/dashboard/Massage-and-Notification/AddMassage'));
const AddNotification = lazy(
  () => import('src/pages/dashboard/Massage-and-Notification/AddNotification')
);
const ListOfMsgNfc = lazy(
  () => import('src/pages/dashboard/Massage-and-Notification/ListMassageAndNotification')
);
const TicketList = lazy(() => import('src/pages/dashboard/Ticket-Management/TicketList'));
const Ticket = lazy(() => import('src/pages/dashboard/Ticket-Management/SingleTicket'));
const AddIncident = lazy(() => import('src/pages/dashboard/Ticket-Management/AddIncident'));
const AddTicket = lazy(() => import('src/pages/dashboard/Ticket-Management/AddTicket'));
const AllIncident = lazy(() => import('src/pages/dashboard/Ticket-Management/AllIncident'));
const SuspendedArtist = lazy(() => import('src/pages/dashboard/Artist/SuspendedArtistList'));
const AllArtist = lazy(() => import('src/pages/dashboard/Artist/AllArtistList'));
const AddCatalog = lazy(() => import('src/pages/dashboard/AddArtwok/Catalog/AddCatalog'));
const CatalogList = lazy(() => import('src/pages/dashboard/AddArtwok/Catalog/CatalogList'));
const AddCollection = lazy(
  () => import('src/pages/dashboard/AddArtwok/Collection-Management/AddCollection')
);
const CollectionList = lazy(
  () => import('src/pages/dashboard/AddArtwok/Collection-Management/CollectionList')
);

const ArtworkList = lazy(() => import('src/pages/dashboard/AddArtwok/ArtworkList'));
const ArtworkDetail = lazy(() => import('src/pages/dashboard/AddArtwok/ArtworkDetail'));
const AddPickList = lazy(() => import('src/pages/dashboard/PickList/AddPicklist'));
const AllPickList = lazy(() => import('src/pages/dashboard/PickList/ListAllPicklist'));
const ReviewArtist = lazy(() => import('src/pages/dashboard/Artist/ArtistReview'));
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
      // { path: 'two', element: <PageTwo /> },
      // { path: 'three', element: <PageThree /> },
      {
        path: 'artist',
        children: [
          // { element: <PageFour />, index: true },
          { path: 'create', element: <CreateArtist /> },
          { path: 'add', element: <AddArtistFormIndex /> },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
          { path: 'list', element: <ArtistList /> },
          { path: 'all', element: <AllArtist /> },
          { path: 'request', element: <ArtistRequest /> },
          { path: 'pending-request', element: <ArtistPendingRequest /> },
          { path: 'suspended-list', element: <SuspendedArtist /> },
          { path: 'review', element: <ReviewArtist /> },
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
          {
            path: 'picklist',
            children: [
              { path: 'add', element: <AddPickList /> },
              { path: 'list', element: <AllPickList /> },
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
          {
            path: 'catalog',
            children: [
              { path: 'add', element: <AddCatalog /> },
              { path: 'list', element: <CatalogList /> },
            ],
          },
          {
            path: 'collection_management',
            children: [
              { path: 'add', element: <AddCollection /> },
              { path: 'list', element: <CollectionList /> },
            ],
          },
          { path: 'addArtwork', element: <AddArtwork /> },
          { path: 'artworkList', element: <ArtworkList /> },
          { path: 'artworkDetail', element: <ArtworkDetail /> },
        ],
        // children: [
        // { path: 'addArtwork', element: <AddArtwork /> },
        // { path: 'artworkList', element: <div>artworkList</div> },
        // ],
      },
      {
        path: 'order',
        children: [
          { path: 'subscribe', element: <OrderList /> },
          { path: 'purchese', element: <OrderPurcheseList /> },
          { path: 'details/:id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { path: 'list', element: <InvoiceList /> },
          { path: 'details', element: <InvoiceDetails /> },
          { path: 'create', element: <InvoiceEdit /> },
          { path: 'edit', element: <InvoiceNew /> },
        ],
      },
      {
        path: 'user',
        children: [
          { path: 'Profile', element: <UserProfile /> },
          // { path: 'cards', element: <div>user cards page</div> },
          { path: 'list', element: <UserList /> },
          // { path: 'create', element: <CreaetUser /> },
          // { path: 'edit', element: <div>edit page</div> },
          { path: 'account', element: <UserAccount /> },
        ],
      },
      // {
      //   path: 'circle',
      //   children: [
      //     { element: <CircleList />, index: true },
      //     { path: 'addcircle', element: <AddCircle/> },
      //     { path: 'circlelist', element: <CircleList/> },
      //     { path: ':id', element: <CircleDetails/> },
      //     { path: ':id/circleedit', element: <CircleEdit/> },
      //   ],
      // },
      {
        path: 'circle',
        children: [
          { element: <CircleList />, index: true },
          { path: 'list', element: <CircleList /> },
          { path: ':title', element: <CircleDetails /> },
          { path: ':title/edit', element: <CircleEdit /> },
          { path: 'new', element: <AddCircle /> },
        ],
      },

      { path: 'logistics', element: <div>This is Logistics page</div> },

      {
        path: 'couponandpromotions',
        children: [
          { path: 'add', element: <AddCoupon /> },
          { path: 'list', element: <ListOfCoupon /> },
        ],
      },

      {
        path: 'subscriptionplan',
        children: [
          { path: 'add', element: <AddPlan /> },
          { path: 'list', element: <PlanList /> },
          { path: 'pay', element: <Payment /> },
        ],
      },

      {
        path: 'faq',
        children: [
          { path: 'add', element: <AddFaq /> },
          { path: 'list', element: <FaqList /> },
        ],
      },

      {
        path: 'kbdatabase',
        children: [
          { path: 'add', element: <AddKB /> },
          { path: 'list', element: <KBList /> },
        ],
      },

      {
        path: 'contentmanagement',
        children: [
          { path: 'list', element: <ContentList /> },
          { path: 'details', element: <div>contentmanagement Details page</div> },
          { path: 'create', element: <CreateContent /> },
          { path: 'edit', element: <div>contentmanagement edit page</div> },
        ],
      },
      { path: 'marketingandcommunication', element: <div> marketingandcommunication page</div> },

      { path: 'insurance', element: <div> insurance page</div> },

      { path: 'mail', element: <Mail /> },

      {
        path: 'tickets',
        children: [
          { path: 'allList', element: <TicketList /> },
          { path: 'ticket', element: <Ticket /> },
          { path: 'addIncident', element: <AddIncident /> },
          { path: 'addTicket', element: <AddTicket /> },
          { path: 'allIncident', element: <AllIncident /> },
        ],
      },
      {
        path: 'notificationAndMessage',
        children: [
          { path: 'addMessage', element: <AddMassage /> },
          { path: 'addNotification', element: <AddNotification /> },
          { path: 'list', element: <ListOfMsgNfc /> },
        ],
      },
    ],
  },
];
