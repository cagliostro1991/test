import IocContainer from '../container/IocContainer';
import SERVICES     from '../services/SERVICES';

import Auth from '../interfaces/Auth';

export default {

  guest (to, from, next) {
    next();
  },

  auth (to, from, next) {
    const auth = IocContainer.get<Auth>(SERVICES.AUTH);

    if (auth.isAuthenticated()) {
      next();
    } else {
      next('/login');
    }
  },
};
