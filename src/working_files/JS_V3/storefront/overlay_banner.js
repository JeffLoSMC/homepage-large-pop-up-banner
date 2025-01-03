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
import general from './components/banner/general'
import defaultPopup from './components/banner/defaultPopup';
import cny2025android from './components/banner/cny2025android';
import cny2025apple from './components/banner/cny2025apple';
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

  const randomDisplaySelect = () => {
    let result = Math.round(Math.random()); // randomly generated 0 to 1

    return result;
  };

  OVERLAYBANNER.initBanner = (target) => {
    const _target = target || document.getElementById('site-preloader');
    const _callback = () => {
      if(randomDisplaySelect() == 0){
        cny2025android({
          rendered: () => POPUP_BANNER.addCountOfShow(1, CAMPAIGN.CNY2025ANDROID),
        });
      } else {
        cny2025apple({
          rendered: () => POPUP_BANNER.addCountOfShow(1, CAMPAIGN.CNY2025APPLE),
        });
      }

      // defaultPopup({
      //   rendered: () => POPUP_BANNER.addCountOfShow(1),
      // });
    };
    return _callback();

      // if (POPUP_BANNER.isNotReachCountOfShow(3) || ASSIST.isDev) {
      //   const _target = target || document.getElementById('site-preloader');
      //   const _callback = () => {
      //     christmas({
      //       rendered: () => POPUP_BANNER.addCountOfShow(1),
      //     });
      //   };
      //   return _callback();
		  // } else {
      //   return;
      // }
  };
  

  // '?banner={{initBannerOn}} e.g.?overlayBanner=mnp-offer-check'
  const initBannerOn = UTIL.getParameterByName('banner');

  if (typeof OVERLAYBANNER[initBannerOn] === 'function') {
    jQuery(document).ready(() => {
      OVERLAYBANNER[initBannerOn]();
    });
  }

})(jQuery, OVERLAYBANNER);
