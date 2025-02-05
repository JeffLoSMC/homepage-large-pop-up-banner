import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/Vday_2025.jsp?o=Android&itm_campaign=202502-vdaypop-v2&itm_source=itm&itm_medium=pop-up-banner&itm_content=v2-android&itm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/Vday_2025.jsp?o=Android&itm_campaign=202502-vdaypop-v2&itm_source=itm&itm_medium=pop-up-banner&itm_content=v2-android&itm_ga=os";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/Vday_popup_banner_ver2/Vday_popup_banner_ver2_v2TC.gif';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/Vday_popup_banner_ver2/Vday_popup_banner_ver2_mob_v2TC.gif';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/Vday_popup_banner_ver2/Vday_popup_banner_ver2_v2EN.gif';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/Vday_popup_banner_ver2/Vday_popup_banner_ver2_mob_v2EN.gif';
  
  const campaignPopupSecond = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.VDAY2025ANDROID,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default campaignPopupSecond;
  