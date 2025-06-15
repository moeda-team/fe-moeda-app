import nookies from 'nookies';

export const getAccessToken = () => {
  const { accessToken } = nookies.get();
  return accessToken;
};