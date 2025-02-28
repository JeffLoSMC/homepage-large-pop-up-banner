import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';

  //default setting for OS storefront popup banner
  //develop view: 1024 x 470 px; mobile view: 232 x 420 px
  //update content by changing the following parameters and "campaign:" in init function
  //you may need to copy a new js file for specific banner with different css styles or extra buttons
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "https://www.smartone.com/SmarTone-CARE/intro/tchinese/index.html?redirect=exclusive&utm_campaign=202502-s25-coupon&utm_source=smartone-care&utm_medium=pop-up-banner&utm_content=s25-coupon&utm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "https://www.smartone.com/SmarTone-CARE/intro/english/index.html?redirect=exclusive&utm_campaign=202502-s25-coupon&utm_source=smartone-care&utm_medium=pop-up-banner&utm_content=s25-coupon&utm_ga=os";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/s25_ultra/s25ultra_os_popup_banner_tc.gif';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/s25_ultra/s25ultra_os_popup_banner_mob_tc.gif';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/s25_ultra/s25ultra_os_popup_banner_en.gif';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/s25_ultra/s25ultra_os_popup_banner_mob_en.gif';
  
  const defaultPopup = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.S25SERIES2025,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default defaultPopup;
  