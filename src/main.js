import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router"; // Твой файл с маршрутами
import "./assets/main.css";

const app = createApp(App);
app.use(router); // ГОВОРИМ VUE ИСПОЛЬЗОВАТЬ РОУТЕР
app.mount("#app");
