import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'   // 导入 element-ui
import 'font-awesome/css/font-awesome.min.css' // 导入 fontawesome 图标库

import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/menu";

// 自定义5种全局请求插件
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false;
Vue.use(ElementUI);

/**
 * 全局前置守卫
 * @to 要去的路径
 * @from 来自哪个路径
 * @next() 执行下面的方法
 */
router.beforeEach((to, from, next) => {
    // 如果来自登陆页面直接通过
   if (to.path == '/') {
       next();
   } else {
       // 如果不是来自登陆页，首先判断是否具有用户数据
       if (window.sessionStorage.getItem("user")) {
           // 初始化菜單
           initMenu(router,store);
           next();
       } else {
           // 没有用户数据就去登陆，然后 redirect 中记录了登陆后直接要去的页面
           next('/?redirect='+to.path);
       }
   }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
