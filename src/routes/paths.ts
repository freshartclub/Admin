// ----------------------------------------------------------------------

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
    }
    
  },
};
