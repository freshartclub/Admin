import { ADMIN_BASE_URL } from 'src/utils/BaseUrls';

export const ARTIST_ENDPOINTS = {
  AddArtist: `${ADMIN_BASE_URL}/artist-register`,
  getArtistDetail: `${ADMIN_BASE_URL}/get-register-artist`,
  activateArtist: `${ADMIN_BASE_URL}/activate-artist`,
  getAllArtist: `${ADMIN_BASE_URL}/get-all-completed-artists`, // ya get-all-artist active artist wali route hai
  getAllArtistInDatabase: `${ADMIN_BASE_URL}/get-all-artists`,
  getAllBecomeArtist: `${ADMIN_BASE_URL}/get-artist-request-list`,
  getAllPendingArtist: `${ADMIN_BASE_URL}/get-artist-pending-list`,
  createNewUser: `${ADMIN_BASE_URL}/create-new-user`,
  getuser: `${ADMIN_BASE_URL}/get-user`,
  suspendedArtist: `${ADMIN_BASE_URL}/suspended-list`,
  suspendArtist: `${ADMIN_BASE_URL}/suspend-artist`,
  unSuspendArtist: `${ADMIN_BASE_URL}/unsuspend-artist`,
  chnageArtistPasswoed: `${ADMIN_BASE_URL}/change-artist-password`,
  addArtwork: `${ADMIN_BASE_URL}/add-artwork`,
  getArtWorkList: `${ADMIN_BASE_URL}/get-artwork-list`,
  getArtistById: `${ADMIN_BASE_URL}/get-artist-by-id`,
};

export const USER_ENDPOINTS = {
  getUserList: `${ADMIN_BASE_URL}/get-all-users`,
};
