import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus, { Notify } from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { router } from "@/router";
import { useRouter } from "vue-router";

const app = createApp(App);

app.use(router);
app.use(ElementPlus, { locale });

declare module "@vue/runtime-core" {
    export interface ComponentCustomProperties {
        $back: () => void;
    }
}

app.config.globalProperties.$back = function () {
    router.go(-1);
};

app.mount("#app");

// 注册全部element plus icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

export default app;
