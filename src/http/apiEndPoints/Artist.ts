import { ADMIN_BASE_URL, GENERAL_BASE_URL } from 'src/utils/BaseUrls';

export const ARTIST_ENDPOINTS = {
  addDiscipline: `${ADMIN_BASE_URL}/add-discipline`,
  getDisciplineById: `${ADMIN_BASE_URL}/get-discipline`,
  addStyle: `${ADMIN_BASE_URL}/add-style`,
  addTheme: `${ADMIN_BASE_URL}/add-theme`,
  addTechnic: `${ADMIN_BASE_URL}/add-technic`,
  addMedia: `${ADMIN_BASE_URL}/add-media`,
  getDiscipline: `${ADMIN_BASE_URL}/list-discipline`,
  getStyle: `${ADMIN_BASE_URL}/list-style`,
  AddArtist: `${ADMIN_BASE_URL}/artist-register`,
  getArtistDetail: `${ADMIN_BASE_URL}/get-register-artist`,
  activateArtist: `${ADMIN_BASE_URL}/activate-artist`,
  getAllArtist: `${ADMIN_BASE_URL}/get-all-completed-artists`,
  getAllArtistInDatabase: `${ADMIN_BASE_URL}/get-all-artists`,
  getAllBecomeArtist: `${ADMIN_BASE_URL}/get-artist-request-list`,
  getAllPendingArtist: `${ADMIN_BASE_URL}/get-artist-pending-list`,
  createNewUser: `${ADMIN_BASE_URL}/create-new-user`,
  getuser: `${ADMIN_BASE_URL}/get-user`,
  suspendedArtist: `${ADMIN_BASE_URL}/suspended-list`,
  suspendArtist: `${ADMIN_BASE_URL}/suspend-artist`,
  rejectRequest: `${ADMIN_BASE_URL}/reject-artist-request`,
  banRequest: `${ADMIN_BASE_URL}/ban-artist-request`,
  unSuspendArtist: `${ADMIN_BASE_URL}/unsuspend-artist`,
  chnageArtistPasswoed: `${ADMIN_BASE_URL}/change-artist-password`,
  addArtwork: `${ADMIN_BASE_URL}/add-artwork`,
  getArtWorkList: `${ADMIN_BASE_URL}/get-artwork-list`,
  getArtistById: `${ADMIN_BASE_URL}/get-artist-by-id`,
  getUserById: `${ADMIN_BASE_URL}/get-user-by-id`,
  getUserByQueryInput: `${ADMIN_BASE_URL}/get-user-by-query-input`,
  removeArtWorkList: `${ADMIN_BASE_URL}/remove-artwork`,
  getAllTickets: `${ADMIN_BASE_URL}/get-all-tickets`,
  replyTicket: `${ADMIN_BASE_URL}/reply-ticket`,
  getTicketReply: `${ADMIN_BASE_URL}/get-ticket-replies`,
  addIncident: `${ADMIN_BASE_URL}/add-incident`,
  addTicket: `${ADMIN_BASE_URL}/add-ticket`,
  getAllIncident: `${ADMIN_BASE_URL}/get-all-incidents`,
};

export const USER_ENDPOINTS = {
  getUserList: `${ADMIN_BASE_URL}/get-all-users`,
};

export const GENERAL_ENDPOINTS = {
  getDiscipline: `${GENERAL_BASE_URL}/list-discipline`,
  getStyle: `${GENERAL_BASE_URL}/list-style`,
  getTechnic: `${GENERAL_BASE_URL}/list-technic`,
  getTheme: `${GENERAL_BASE_URL}/list-theme`,
  getMedia: `${GENERAL_BASE_URL}/list-media`,
};
