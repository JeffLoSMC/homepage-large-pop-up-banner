import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/Vday_2025.jsp?itm_campaign=202502-vdaypop-v1&itm_source=itm&itm_medium=pop-up-banner&itm_content=v1-apple&itm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/Vday_2025.jsp?itm_campaign=202502-vdaypop-v1&itm_source=itm&itm_medium=pop-up-banner&itm_content=v1-apple&itm_ga=os";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/Vday_popup_banner_ver1/Vday_popup_banner_ver1_TC.gif';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/Vday_popup_banner_ver1/Vday_popup_banner_ver1_mobTC.gif';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/Vday_popup_banner_ver1/Vday_popup_banner_ver1_EN.gif';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/Vday_popup_banner_ver1/Vday_popup_banner_ver1_mobEN.gif';
  
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
  