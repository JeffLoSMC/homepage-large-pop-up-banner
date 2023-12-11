import {
  LOCALE_TC,
  LOCALE_EN,
  COOKIES_NAME,
  PROMO_CODE,
  CAMPAIGN
} from './constant';
import UTIL from './util';
import ASSIST from './assist';
import COOKIES from './cookie';
import MODAL from './modal';
import general from './components/banner/general';
import POPUP_BANNER from './components/banner';

if (typeof OVERLAYBANNER === 'undefined') {
  window.OVERLAYBANNER = new Object();
}

OVERLAYBANNER.HOMEPAGE_LARGE_POPUP_BANNER = {
  LOCALE_TC,
  LOCALE_EN,
  COOKIES_NAME,
  PROMO_CODE,
  OBSERVER: {},
  ASSIST,
  MODAL,
  UTIL,
  COOKIES,
  POPUP_BANNER,
  CAMPAIGN,
};

(function (jQuery, OVERLAYBANNER) {
  const {
    LOCALE_TC,
    LOCALE_EN,
    COOKIES_NAME,
    PROMO_CODE,
    OBSERVER,
    ASSIST,
    MODAL,
    UTIL,
    COOKIES,
    POPUP_BANNER,
    CAMPAIGN
  } = OVERLAYBANNER.HOMEPAGE_LARGE_POPUP_BANNER;

  OBSERVER.config = {
    attributes: true,
    childList: true,
    characterData: true,
  };
  // Configuration of the observer:
  OBSERVER.init = ({
    target,
    onMutate
  }) => {
    OBSERVER.watch = new MutationObserver((mutation) => {
      // observing loading function
      onMutate(target);
      if (!!OBSERVER.watch.disconnect) {
        OBSERVER.watch.disconnect();
      }
    });
    // Pass in the target node, as well as the observer options
    return OBSERVER.watch.observe(target, OBSERVER.config);
  };

  OVERLAYBANNER.initBanner = () => {                
      return;
      if ((POPUP_BANNER.isNotReachCountOfShow(3) && ASSIST.isDataAndroid()) || ASSIST.isDev) {
        general({
          rendered: () => POPUP_BANNER.addCountOfShow(1),
        });
		  }    
  };

  const initBannerOn = UTIL.getParameterByName('banner');

  if (typeof OVERLAYBANNER[initBannerOn] === 'function') {
    jQuery(document).ready(() => {
      OVERLAYBANNER[initBannerOn]();
    });
  }

})(jQuery, OVERLAYBANNER);
