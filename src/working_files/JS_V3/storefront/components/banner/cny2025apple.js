import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/cny_2025.jsp?itm_campaign=202501-cnypop-v2&itm_source=itm&itm_medium=pop-up-banner&itm_content=v2-apple&itm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/cny_2025.jsp?itm_campaign=202501-cnypop-v2&itm_source=itm&itm_medium=pop-up-banner&itm_content=v2-apple&itm_ga=os";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/cny2025/CNY_popup_banner_ver1_TC.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/cny2025/CNY_popup_banner_ver1_mobTC.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/cny2025/CNY_popup_banner_ver1_EN.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/cny2025/CNY_popup_banner_ver1_mobEN.jpg';
  
  const cny2025apple = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.CNY2025APPLE,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default cny2025apple;
  