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
      email: {
        root: `${ROOTS.DASHBOARD}/email`,
        add: `${ROOTS.DASHBOARD}/category/email/add`,
        list: `${ROOTS.DASHBOARD}/category/email/list`,
      },
    },
    customise: {
      Root: `${ROOTS.DASHBOARD}/customise`,
      file: {
        root: `${ROOTS.DASHBOARD}/file`,
        add: `${ROOTS.DASHBOARD}/customise/file/add`,
      },
      homeArtwork: {
        root: `${ROOTS.DASHBOARD}/home-artwork`,
        add: `${ROOTS.DASHBOARD}/customise/home-artwork/add`,
        list: `${ROOTS.DASHBOARD}/customise/home-artwork/list`,
      },
      carousel: {
        add: `${ROOTS.DASHBOARD}/customise/carousel/add`,
        list: `${ROOTS.DASHBOARD}/customise/carousel/list`,
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
        root: `${ROOTS.DASHBOARD}/collection-management`,
        add: `${ROOTS.DASHBOARD}/artwork/collection-management/add`,
        list: `${ROOTS.DASHBOARD}/artwork/collection-management/list`,
      },
      addArtwork: `${ROOTS.DASHBOARD}/artwork/addartwork`,
      reviewArtwork: (id: string) => `${ROOTS.DASHBOARD}/artwork/review/${id}`,
      artworkList: `${ROOTS.DASHBOARD}/artwork/artworkList`,
      artworkDetail: `${ROOTS.DASHBOARD}/artwork/artworkDetail`,
    },

    order: {
      Root: `${ROOTS.DASHBOARD}/order`,
      list: `${ROOTS.DASHBOARD}/order/list`,
      // purchese: `${ROOTS.DASHBOARD}/order/purchese`,
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
      list: `${ROOTS.DASHBOARD}/user/list`,
      profile: (id: string) => `${ROOTS.DASHBOARD}/user/profile/${id}`,
    },
    circle: {
      root: `${ROOTS.DASHBOARD}/circle`,
      add: `${ROOTS.DASHBOARD}/circle/add`,
      list: `${ROOTS.DASHBOARD}/circle/list`,
    },

    visualize: {
      root: `${ROOTS.DASHBOARD}/visualize`,
      add: `${ROOTS.DASHBOARD}/visualize/add`,
      list: `${ROOTS.DASHBOARD}/visualize/list`,
    },

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
