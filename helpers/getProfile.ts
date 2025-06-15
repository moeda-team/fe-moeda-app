import { getAccessToken } from './getAccessToken';
import {jwtDecode} from 'jwt-decode'

const getProfile = () => {
  const accessToken = getAccessToken();
  const decodedToken: any = accessToken ? jwtDecode(accessToken) : {};
  if(!decodedToken) {
    return {};
  }
  const { userId, outletId } = decodedToken;
  return { userId, outletId };
}
export default getProfile;