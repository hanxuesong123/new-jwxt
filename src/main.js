import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import config from './config'

import iView from 'iview';
import iEditor from 'iview-editor';
import 'iview/dist/styles/iview.css';
import 'iview-editor/dist/iview-editor.css';

import SelfTable from '@/components/table/SelfTable.vue'
import access from '@/utils/has_permission.js'

import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false;
Vue.prototype.$config = config; //全局注册应用配置
Vue.prototype.$access = access;

Vue.component("self-table",SelfTable);
Vue.use(iView);
Vue.use(iEditor);
Vue.use(elementUI);



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
