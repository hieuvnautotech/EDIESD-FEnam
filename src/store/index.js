////SYSTEM
import * as resetStores from './system/useResetAllStores';
import useTokenStore from './system/useTokenStore';
import useUserStore from './system/useUserStore';
import useMenuStore from './system/useMenuStore';
import useLanguageStore from './system/useLanguageStore';

/**
 * STANDARD
 * CONFIGURATION
 */
////ROLE
import useRoleStore from './Standard/Configuration/Role/useRoleStore';

/**
 * EDI
 * LOG
 */
import useLogfileStore from './EDI/Log/useLogfileStore';

export {
  ////SYSTEM
  resetStores,
  useTokenStore,
  useUserStore,
  useMenuStore,
  useLanguageStore,

  /**
   * STANDARD
   * CONFIGURATION
   */
  ////ROLE
  useRoleStore,

  /**
   * EDI
   * LOG
   */
  useLogfileStore,
};
