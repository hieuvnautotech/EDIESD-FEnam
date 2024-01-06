import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CURRENT_USER } from '@constants/ConfigConstants';

// define the initial state
const initialUser = {
  userId: null,
  userName: null,
  lastLoginOnWeb: null,
  RoleNameList: null,
  RoleCodeList: null,
  row_version: null,
};

const useUserStore = create(
  persist(
    (set, get) => ({
      user: initialUser,
      kickOutState: false,
      kickOutMessage: 'general.Initializing',
      missingPermission: [],
      missingPermissionGroupByRole: [],

      dispatchSetUser: (user) => {
        set({ user: user });
      },

      dispatchRemoveUser: () => {
        set({ user: initialUser });
        set({ missingPermission: [] });
        set({ missingPermissionGroupByRole: [] });
        // localStorage.removeItem(CURRENT_USER);
      },

      dispatchSetKickOutState: (flag) => {
        set({ kickOutState: flag });
      },
      dispatchSetKickOutMessage: (message) => set({ kickOutMessage: message }),

      dispatchSetMissingPermission: (missingPermissionData) => set({ missingPermission: missingPermissionData }),
      dispatchSetMissingPermissionGroupByRole: (missingPermissionGroupByRoleData) =>
        set({ missingPermissionGroupByRole: missingPermissionGroupByRoleData }),
    }),
    {
      name: CURRENT_USER, // unique name
    }
  )
);

export default useUserStore;
