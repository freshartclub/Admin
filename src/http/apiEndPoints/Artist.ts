import { ADMIN_BASE_URL } from 'src/utils/BaseUrls';

export const ARTIST_ENDPOINTS = {
  AddArtist: `${ADMIN_BASE_URL}/artist-register`,
  getArtistDetail: `${ADMIN_BASE_URL}/get-register-artist`,
  activateArtist: `${ADMIN_BASE_URL}/activate-artist`,
};
