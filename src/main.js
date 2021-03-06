import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import config from './config'

import iView from 'iview';
import iEditor from 'iview-editor';
import 'iview/dist/styles/iview.css';
import 'iview-editor/dist/iview-editor.css';
import VideoPlayer from 'vue-video-player'
import SelfTable from '@/components/table/SelfTable.vue'
import access from '@/utils/has_permission.js'
import Charts from '@/components/echarts/index.vue'
import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import eCharts from 'echarts';
import countTo from 'vue-count-to'
import InfoCard from '@/components/info-card/infor-card.vue'


require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.config.productionTip = false;
Vue.prototype.$config = config; //全局注册应用配置
Vue.prototype.$access = access;
Vue.prototype.$echarts = eCharts;

Vue.component("count-to",countTo);
Vue.component("self-table",SelfTable);
Vue.component("charts",Charts);
Vue.component("info-card",InfoCard);
Vue.use(iView);
Vue.use(iEditor);
Vue.use(elementUI);
Vue.use(VideoPlayer);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
