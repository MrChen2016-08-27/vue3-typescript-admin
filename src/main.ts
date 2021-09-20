import { createApp } from 'vue';
import App from './App.vue'

import ElementPlus from 'element-plus';
import { INotification } from 'element-plus/lib/el-notification/src/notification.type'
import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import { router } from '@/router';
import { useRouter } from 'vue-router';




const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale })

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
      $back: () => void,
      $notify: INotification
    }
}


app.config.globalProperties.$back = function () {
    router.go(-1);
}




app.mount('#app')

export default  app;
