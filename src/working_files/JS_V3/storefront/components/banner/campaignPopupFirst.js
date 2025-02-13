import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';

  //default setting for OS storefront popup banner when there are two banner versions
  //develop view: 1024 x 470 px; mobile view: 232 x 420 px
  //update content by changing the following parameters and "campaign:" in init function
  //you may need to copy a new js file for specific banner with different css styles or extra buttons
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/Vday_2025.jsp?itm_campaign=202502-vdaypop-v1v2&itm_source=itm&itm_medium=pop-up-banner&itm_content=v1v2-apple&itm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/Vday_2025.jsp?itm_campaign=202502-vdaypop-v1v2&itm_source=itm&itm_medium=pop-up-banner&itm_content=v1v2-apple&itm_ga=os";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/wvday_ver1/wvday_popup_banner_ver1_v1_tc.gif';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/wvday_ver1/wvday_popup_banner_ver1_mob_v1_tc.gif';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/wvday_ver1/wvday_popup_banner_ver1_v1_en.gif';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/wvday_ver1/wvday_popup_banner_ver1_mob_v1_en.gif';
  
  const campaignPopupFirst = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.VDAY2025APPLE,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default campaignPopupFirst;
  