import { _id, _postTitles } from 'src/_mock/assets';
import { paramCase } from 'src/utils/change-case';

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  artist: '/artist',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      signInOptVerification: `${ROOTS.AUTH}/jwt/opt-verification`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    artist: {
      Root: `${ROOTS.DASHBOARD}/artist`,
      createArtist: `${ROOTS.DASHBOARD}/artist/create`,
      addArtist: `${ROOTS.DASHBOARD}/artist/add`,
      allArtist: `${ROOTS.DASHBOARD}/artist/all`,
      reviewArtist: `${ROOTS.DASHBOARD}/artist/review`,
      artistList: `${ROOTS.DASHBOARD}/artist/list`,
      suspendList: `${ROOTS.DASHBOARD}/artist/suspended-list`,

      artistRequest: `${ROOTS.DASHBOARD}/artist/request`,
      artistPendingRequest: `${ROOTS.DASHBOARD}/artist/pending-request`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    category: {
      root: `${ROOTS.DASHBOARD}/category`,
      discipline: {
        root: `${ROOTS.DASHBOARD}/discipline`,
        add: `${ROOTS.DASHBOARD}/category/discipline/add`,
        list: `${ROOTS.DASHBOARD}/category/discipline/list`,
      },
      style: {
        root: `${ROOTS.DASHBOARD}/style`,
        add: `${ROOTS.DASHBOARD}/category/style/add`,
        list: `${ROOTS.DASHBOARD}/category/style/list`,
      },
      technic: {
        root: `${ROOTS.DASHBOARD}/technic`,
        add: `${ROOTS.DASHBOARD}/category/technic/add`,
        list: `${ROOTS.DASHBOARD}/category/technic/list`,
      },
      theme: {
        root: `${ROOTS.DASHBOARD}/theme`,
        add: `${ROOTS.DASHBOARD}/category/theme/add`,
        list: `${ROOTS.DASHBOARD}/category/theme/list`,
      },
      mediasupport: {
        root: `${ROOTS.DASHBOARD}/mediasupport`,
        add: `${ROOTS.DASHBOARD}/category/mediasupport/add`,
        list: `${ROOTS.DASHBOARD}/category/mediasupport/list`,
      },
      picklist: {
        root: `${ROOTS.DASHBOARD}/picklist`,
        add: `${ROOTS.DASHBOARD}/category/picklist/add`,
        list: `${ROOTS.DASHBOARD}/category/picklist/list`,
      },
    },
    creadentialsAndInsigniasArea: {
      root: `${ROOTS.DASHBOARD}/creadentialsAndInsigniasArea`,
      add: `${ROOTS.DASHBOARD}/creadentialsAndInsigniasArea/add`,
      list: `${ROOTS.DASHBOARD}/creadentialsAndInsigniasArea/list`,
    },
    artwork: {
      Root: `${ROOTS.DASHBOARD}/artwork`,
      catalog: {
        root: `${ROOTS.DASHBOARD}/catalog`,
        add: `${ROOTS.DASHBOARD}/artwork/catalog/add`,
        list: `${ROOTS.DASHBOARD}/artwork/catalog/list`,
      },
      collection_management: {
        root: `${ROOTS.DASHBOARD}/collection_management`,
        add: `${ROOTS.DASHBOARD}/artwork/collection_management/add`,
        list: `${ROOTS.DASHBOARD}/artwork/collection_management/list`,
      },
      addArtwork: `${ROOTS.DASHBOARD}/artwork/addartwork`,
      reviewArtwork: (id: string) => `${ROOTS.DASHBOARD}/artwork/review/${id}`,
      artworkList: `${ROOTS.DASHBOARD}/artwork/artworkList`,
      artworkDetail: `${ROOTS.DASHBOARD}/artwork/artworkDetail`,
    },

    // try start
    order: {
      Root: `${ROOTS.DASHBOARD}/order`,
      subscribe: `${ROOTS.DASHBOARD}/order/subscribe`,
      purchese: `${ROOTS.DASHBOARD}/order/purchese`,
      details: `${ROOTS.DASHBOARD}/order/details`,
    },
    invoice: {
      Root: `${ROOTS.DASHBOARD}/invoice`,
      list: `${ROOTS.DASHBOARD}/invoice/list`,
      details: `${ROOTS.DASHBOARD}/invoice/details`,
      create: `${ROOTS.DASHBOARD}/invoice/create`,
      edit: `${ROOTS.DASHBOARD}/invoice/edit`,
    },
    user: {
      Root: `${ROOTS.DASHBOARD}/user`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      // cards: `${ROOTS.DASHBOARD}/user/cards`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      // create: `${ROOTS.DASHBOARD}/user/create`,
      // edit: `${ROOTS.DASHBOARD}/user/edit`,
      account: `${ROOTS.DASHBOARD}/user/account`,
    },
    //  circle: {
    //   Root: `${ROOTS.DASHBOARD}/circle`,
    //   addcircle: `${ROOTS.DASHBOARD}/circle/addcircle`,
    //   circlelist: `${ROOTS.DASHBOARD}/circle/circlelist`,
    //   // circledetails: `${ROOTS.DASHBOARD}/circle/circledetails`,
    //   // circleedit: `${ROOTS.DASHBOARD}/circle/circleedit`,
    //   circledetails: (id: string) => `${ROOTS.DASHBOARD}/circle/${id}`,
    //   circleedit: (id: string) => `${ROOTS.DASHBOARD}/circle/${id}/circleedit`,
    //   demo: {
    //     circledetails: `${ROOTS.DASHBOARD}/circle/${MOCK_ID}`,
    //     circleedit: `${ROOTS.DASHBOARD}/circle/${MOCK_ID}/circleedit`,
    //   },
    //  },
    circle: {
      root: `${ROOTS.DASHBOARD}/circle`,
      new: `${ROOTS.DASHBOARD}/circle/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/circle/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/circle/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/circle/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/circle/${paramCase(MOCK_TITLE)}/edit`,
      },
    },

    logistics: `${ROOTS.DASHBOARD}/logistics`,

    couponandpromotions: {
      Root: `${ROOTS.DASHBOARD}/couponandpromotions`,
      add: `${ROOTS.DASHBOARD}/couponandpromotions/add`,
      list: `${ROOTS.DASHBOARD}/couponandpromotions/list`,
    },

    subscriptionplan: {
      Root: `${ROOTS.DASHBOARD}/subscriptionplan`,
      add: `${ROOTS.DASHBOARD}/subscriptionplan/add`,
      list: `${ROOTS.DASHBOARD}/subscriptionplan/list`,
      pay: `${ROOTS.DASHBOARD}/subscriptionplan/pay`,
    },

    faq: {
      Root: `${ROOTS.DASHBOARD}/faq`,
      add: `${ROOTS.DASHBOARD}/faq/add`,
      list: `${ROOTS.DASHBOARD}/faq/list`,
    },
    kbdatabase: {
      Root: `${ROOTS.DASHBOARD}/kbdatabase`,
      add: `${ROOTS.DASHBOARD}/kbdatabase/add`,
      list: `${ROOTS.DASHBOARD}/kbdatabase/list`,
    },

    contentmanagement: {
      Root: `${ROOTS.DASHBOARD}/contentmanagement`,
      list: `${ROOTS.DASHBOARD}/contentmanagement/list`,
      details: `${ROOTS.DASHBOARD}/contentmanagement/details`,
      create: `${ROOTS.DASHBOARD}/contentmanagement/create`,
      edit: `${ROOTS.DASHBOARD}/contentmanagement/edit`,
    },

    marketingandcommunication: `${ROOTS.DASHBOARD}/marketingandcommunication`,

    insurance: `${ROOTS.DASHBOARD}/insurance`,

    mail: `${ROOTS.DASHBOARD}/mail`,

    tickets: {
      Root: `${ROOTS.DASHBOARD}/tickets`,
      allList: `${ROOTS.DASHBOARD}/tickets/allList`,
      addIncident: `${ROOTS.DASHBOARD}/tickets/addIncident`,
      allIncident: `${ROOTS.DASHBOARD}/tickets/allIncident`,
      addTicket: `${ROOTS.DASHBOARD}/tickets/addTicket`,
      singleList: `${ROOTS.DASHBOARD}/tickets/ticket`,
    },

    notificationAndMessage: {
      Root: `${ROOTS.DASHBOARD}/notificationAndMessage`,
      addMessage: `${ROOTS.DASHBOARD}/notificationAndMessage/addMessage`,
      addNotification: `${ROOTS.DASHBOARD}/notificationAndMessage/addNotification`,
      List: `${ROOTS.DASHBOARD}/notificationAndMessage/list`,
    },
  },
};
