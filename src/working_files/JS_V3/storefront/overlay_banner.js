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
import christmas from './components/banner/christmas';
import cnyRewards from './components/banner/cnyRewards';
import easter from './components/banner/easter';
import mother from './components/banner/mother';
import father from './components/banner/father';
import backToSchool from './components/banner/backToSchool';
import flipfold from './components/banner/flipfold';
import iphone16 from './components/banner/iphone16';
import double11 from './components/banner/double11';
import blackfriday2024 from './components/banner/blackfriday2024';
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

  OVERLAYBANNER.initBanner = (target) => {
    const _target = target || document.getElementById('site-preloader');
    const _callback = () => {
      blackfriday2024({
        rendered: () => POPUP_BANNER.addCountOfShow(1),
      });
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
  
  const initBannerOn = UTIL.getParameterByName('banner');

  if (typeof OVERLAYBANNER[initBannerOn] === 'function') {
    jQuery(document).ready(() => {
      OVERLAYBANNER[initBannerOn]();
    });
  }

})(jQuery, OVERLAYBANNER);
