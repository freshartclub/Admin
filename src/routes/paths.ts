// ----------------------------------------------------------------------

import { hydrateRoot } from "react-dom/client";
import { _id, _postTitles } from 'src/_mock/assets';

const MOCK_ID = _id[1];

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
      addArtist: `${ROOTS.DASHBOARD}/artist/add`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    category: {
      root: `${ROOTS.DASHBOARD}/category`,
      discipline:{
      root: `${ROOTS.DASHBOARD}/discipline`,
      add : `${ROOTS.DASHBOARD}/category/discipline/add`,
      list : `${ROOTS.DASHBOARD}/category/discipline/list`
     },
     style:{
      root: `${ROOTS.DASHBOARD}/style`,
      add : `${ROOTS.DASHBOARD}/category/style/add`,
      list : `${ROOTS.DASHBOARD}/category/style/list`
     },
     technic:{
      root: `${ROOTS.DASHBOARD}/technic`,
      add : `${ROOTS.DASHBOARD}/category/technic/add`,
      list : `${ROOTS.DASHBOARD}/category/technic/list`
     },
     theme:{
      root: `${ROOTS.DASHBOARD}/theme`,
      add : `${ROOTS.DASHBOARD}/category/theme/add`,
      list : `${ROOTS.DASHBOARD}/category/theme/list`
     },
     mediasupport:{
      root: `${ROOTS.DASHBOARD}/mediasupport`,
      add : `${ROOTS.DASHBOARD}/category/mediasupport/add`,
      list : `${ROOTS.DASHBOARD}/category/mediasupport/list`
     }
    },
    creadentialsAndInsigniasArea:{
      root: `${ROOTS.DASHBOARD}/creadentialsAndInsigniasArea`,
      add: `${ROOTS.DASHBOARD}/creadentialsAndInsigniasArea/add`,
      list: `${ROOTS.DASHBOARD}/creadentialsAndInsigniasArea/list`
    },
     artwork:{
      Root: `${ROOTS.DASHBOARD}/artwork`,
      addArtwork: `${ROOTS.DASHBOARD}/artwork/addartwork`,
      artworkList: `${ROOTS.DASHBOARD}/artwork/artworkList`
    },

    // try start
    order: {
      Root: `${ROOTS.DASHBOARD}/order`,
      subscribe: `${ROOTS.DASHBOARD}/order/subscribe`,
      purchese: `${ROOTS.DASHBOARD}/order/purchese`,
      // details: `${ROOTS.DASHBOARD}/order/details`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
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
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      create: `${ROOTS.DASHBOARD}/user/create`,
      edit: `${ROOTS.DASHBOARD}/user/edit`,
      account: `${ROOTS.DASHBOARD}/user/account`,
    },
     circle: {
      Root: `${ROOTS.DASHBOARD}/circle`,
      addcircle: `${ROOTS.DASHBOARD}/circle/addcircle`,
      circlelist: `${ROOTS.DASHBOARD}/circle/circlelist`,
     },

     logistics: `${ROOTS.DASHBOARD}/logistics`,
     couponandpromotions: `${ROOTS.DASHBOARD}/couponandpromotions`,

     subscriptionplan: `${ROOTS.DASHBOARD}/subscriptionplan`,
     faq: `${ROOTS.DASHBOARD}/faq`,


     kbdatabase: `${ROOTS.DASHBOARD}/kbdatabase`,
   
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

    helpandsupport: `${ROOTS.DASHBOARD}/helpandsupport`,
    
    // try end
  },
};
