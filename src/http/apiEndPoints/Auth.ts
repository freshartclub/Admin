import { ADMIN_BASE_URL } from 'src/utils/BaseUrls';

export const AUTH_ENDPOINTS = {
  SignIn: `${ADMIN_BASE_URL}/send-login-otp `,
  CheckToken: `${ADMIN_BASE_URL}/dashboard`,
  ValidateOtp: `${ADMIN_BASE_URL}/validate-otp`,
  ResendOtp: `${ADMIN_BASE_URL}/resend-otp`,

};
