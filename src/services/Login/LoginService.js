import { axios } from '@utils';
import { LOGIN_URL } from '@constants/ConfigConstants';

export const handleLogin = async (userName, userPassword) => {
  try {
    return await axios.post(LOGIN_URL, {
      userName: userName,
      userPassword: userPassword,
      isOnApp: false,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const getUserInfo = async () => {
  try {
    return await axios.get('/api/login/user-info');
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export const handleLogout = async () => {
  return await axios.post('/api/logout', {});
};

// export {
//     handleLogin,
//     getUserInfo,
//     handleLogout,
// }
