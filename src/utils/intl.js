import intl from 'react-intl-universal';

const locales = {
  'en': require('../locales/en_US.json'),
  'zh': require('../locales/zh_CN.json'),
};
let lang = (navigator.languages && navigator.languages[0]) || navigator.language
intl.init({
  currentLocale: lang.split('-')[0],
  locales: locales
})

export default intl;

