import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as ConfigConstants from '@constants/ConfigConstants';

const useMenuStore = create(
  persist(
    (set, get) => ({
      menu: [],
      menuGroupByRole: [],
      menuHtml: '',
      dispatchSetMenu: (userMenu) => set({ menu: userMenu }),
      dispatchSetMenuGroupByRole: (data) => set({ menuGroupByRole: data }),
      dispatchSetMenuHtml: (html) => set({ menuHtml: html }),

      dispatchRemoveMenu: () => {
        set({ menu: [] });
        set({ menuGroupByRole: [] });
        set({ menuHtml: '' });
      },
    }),
    {
      name: ConfigConstants.CURRENT_MENU, // unique name
    }
  )
);

export default useMenuStore;
