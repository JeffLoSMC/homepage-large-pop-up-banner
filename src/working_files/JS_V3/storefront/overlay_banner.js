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
import campaignPopupFirst from './components/banner/campaignPopupFirst';
import campaignPopupSecond from './components/banner/campaignPopupSecond';
import importantNotice from './components/banner/importantNotice';
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

  const twoCampaignSelect = (campaign1, campaign2) => {
    let showCount1 = POPUP_BANNER.showCount(campaign1);
    let showCount2 = POPUP_BANNER.showCount(campaign2);

    let campaignResult = null;

    // if one banner showcount is higher, display the other banner
    if(showCount1 < showCount2){
      campaignResult = campaign1
    } 
    else if(showCount2 < showCount1){
      campaignResult = campaign2
    } 
    else {  // when both showCount is equal, random select between two banners, ratio 50:50
      campaignResult = randomDisplaySelect() == 0? campaign1 : campaign2;
    }

    return campaignResult;
  }


  // OVERLAYBANNER.initBanner = (target, specific) => {
  //   const _target = target || document.getElementById('site-preloader');

  //   // //two banners
  //   // const _callback = () => {
  //   //   if(specific == "cnyWorkingHour"){
  //   //     importantNotice({
  //   //       rendered: () => POPUP_BANNER.addCountOfShow(1, CAMPAIGN.IMPORTANTNOTICE),
  //   //     });
  //   //   }else{
  //   //     let selectedCampaign = twoCampaignSelect(CAMPAIGN.VDAY2025APPLE, CAMPAIGN.VDAY2025ANDROID);
  //   //     if(selectedCampaign == CAMPAIGN.VDAY2025APPLE){
  //   //       campaignPopupFirst({
  //   //         rendered: () => POPUP_BANNER.addCountOfShow(1, CAMPAIGN.VDAY2025APPLE),
  //   //       });
  //   //     }
  //   //     if(selectedCampaign == CAMPAIGN.VDAY2025ANDROID){
  //   //       campaignPopupSecond({
  //   //         rendered: () => POPUP_BANNER.addCountOfShow(1, CAMPAIGN.VDAY2025ANDROID),
  //   //       });
  //   //     }
  //   //   }
  //   // };

  //   //if there is ONLY ONE version for the popup banner
  //   const _callback = () => {
  //     defaultPopup({
  //       rendered: () => POPUP_BANNER.addCountOfShow(1, CAMPAIGN.S25SERIES2025),
  //     });
  //   };
    
  //   return _callback();


  //   // if (POPUP_BANNER.isNotReachCountOfShow(3) || ASSIST.isDev) {
  //   //   const _target = target || document.getElementById('site-preloader');
  //   //   const _callback = () => {
  //   //     christmas({
  //   //       rendered: () => POPUP_BANNER.addCountOfShow(1),
  //   //     });
  //   //   };
  //   //   return _callback();
	// 	// } else {
  //   //   return;
  //   // }  
  // };
  

  // '?banner={{initBannerOn}} e.g.?overlayBanner=mnp-offer-check'
  const initBannerOn = UTIL.getParameterByName('banner');

  if (typeof OVERLAYBANNER[initBannerOn] === 'function') {
    jQuery(document).ready(() => {
      OVERLAYBANNER[initBannerOn]();
    });
  }

})(jQuery, OVERLAYBANNER);
