import { create } from 'zustand';

const useRoleStore = create((set, get) => ({
  selectedRoleId: 0,
  dispatchSetSelectedRoleId: (roleId) => {
    set({ selectedRoleId: roleId });
  },

  selectedRoleCode: '',
  dispatchSetSelectedRoleCode: (roleCode) => {
    set({ selectedRoleCode: roleCode });
  },

  selectedMenu: [],
  dispatchSetSelectedMenu: (data, mode) => {
    const menu = get().selectedMenu;

    switch (mode) {
      case 'ADD':
        set({ selectedMenu: [...menu, ...data] });
        break;

      default:
        set({ selectedMenu: [...data] });
        break;
    }
  },
}));

export default useRoleStore;
