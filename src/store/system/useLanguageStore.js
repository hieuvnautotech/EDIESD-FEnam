import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import * as ConfigConstants from '@constants/ConfigConstants';

// define the initial state
const initialLanguage = 'EN';

const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: initialLanguage,
      dispatchSetLanguage: (lang) => {
        set({ language: lang });
      },
    }),
    {
      name: ConfigConstants.LANG_CODE, // unique name
    }
  )
);

export default useLanguageStore;
