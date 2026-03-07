import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add interceptor to append current language to requests
window.axios.interceptors.request.use(config => {
    // i18next stores language in localStorage key 'i18nextLng'
    const lang = localStorage.getItem('i18nextLng') || 'th';
    config.headers['Accept-Language'] = lang;
    return config;
});
