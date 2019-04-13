// Styles
import 'typeface-montserrat';
import './styles/main.scss';

import vue from 'vue';

// Import  Vue Router & Vuex Store & Base App component
import Router from './router/Router';
import Store  from './store/Store';
import App    from './components/app/App';


const app = new vue({
  el: '#app-main',
  store: Store,
  router: Router,
  render: h => h(App),
});

export default app;
