import { LOCALE_EN, LOCALE_TC } from '../constant';

const ASSIST = {};

ASSIST.getMobileOperatingSystem = function () {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"｛
  if (/windows phone/i.test(userAgent)) {
    return 'WindowsPhone';
  }
  if (/android/i.test(userAgent)) {
    return 'Android';
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }
  return 'unknown';
};

ASSIST.getLangSEO = function () {
  if (jQuery('html').attr('lang') == 'en-hk') {
    return LOCALE_EN;
  } else {
    return LOCALE_TC;
  }
};

ASSIST.isEng = function () {
  const sLang = sLangSEO == 'en' ? 'english' : 'tchinese';
  return sLang == 'english';
};

ASSIST.isMobile = function () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  //return jQuery(window).width() < 840;
};

ASSIST.isDev = window.location.href.indexOf('localhost') > -1;

ASSIST.isDataAndroid = function() {
  const bAndroid = (document.querySelector('script[data-is-android]') == null ? false : document.querySelector('script[data-is-android]').getAttribute("data-is-android"));
  
  return bAndroid == "true";
};

export default ASSIST;
