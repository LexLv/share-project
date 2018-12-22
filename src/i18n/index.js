import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

Vue.use(VueI18n)
const messages = {
  zh,
  en
}
const language = GetQueryString('language') == '' ?((/^zh$|^zh-CN$/i.test(navigator.language)) ? 'zh':'en'):GetQueryString('language')
const i18n = new VueI18n({
  locale: language,
  messages
})

function GetQueryString(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
  if(r!=null)return  unescape(r[2]); return '';
}

window.i18n = i18n

export default i18n
