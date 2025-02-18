import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import { fakeBackend } from '@/utils/helpers/fake-backend';
import 'vue3-carousel/dist/carousel.css';
import './assets/tailwind.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


//Mock Api data
import './_mockApis';
import Maska from 'maska';

//LightBox
import VueEasyLightbox from 'vue-easy-lightbox';

// นำเข้าไอคอนที่ต้องการ
import { faChevronDown, faCalendar, faDownload } from '@fortawesome/free-solid-svg-icons';

// เพิ่มไอคอนเข้าไปในไลบรารี
library.add(faChevronDown, faCalendar, faDownload);
//i18
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';
//ScrollTop
import VueScrollTo from 'vue-scrollto';
const i18n = createI18n({
    locale: 'en',
    messages: messages,
    silentTranslationWarn: true,
    silentFallbackWarn: true
});

const app = createApp(App);
fakeBackend();
app.use(router);
// ลงทะเบียนคอมโพเนนต์ FontAwesome
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(PerfectScrollbar);
app.use(createPinia());
app.use(VueTablerIcons);
// app.use(print);
app.use(i18n);
app.use(Maska);
app.use(VueApexCharts);
app.use(VueEasyLightbox)
app.use(vuetify).mount('#app');
//ScrollTop Use
// app.use(VueScrollTo);
app.use(VueScrollTo, {
    duration: 1000,
    easing: "ease",
    offset: -50,
})