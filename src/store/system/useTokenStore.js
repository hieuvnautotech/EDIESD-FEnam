import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import * as ConfigConstants from '@constants/ConfigConstants';

// define the initial state
const initialToken = {
  accessToken: null,
  refreshToken: null,
};

const useTokenStore = create(
  persist(
    (set, get) => ({
      ...initialToken,
      dispatchSetAccessToken: (token) => {
        set({ accessToken: token });
      },
      dispatchSetRefreshToken: (token) => {
        set({ refreshToken: token });
      },
      dispatchRemoveToken: () => {
        set(initialToken);
        localStorage.removeItem(ConfigConstants.TOKEN);
      },
    }),
    {
      name: ConfigConstants.TOKEN, // unique name
      storage: createJSONStorage(() => localStorage),
      //   storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useTokenStore;
