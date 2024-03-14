import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};
  
  CONTENT.TC.DEFAULT_TERMS = ``;
  CONTENT.EN.DEFAULT_TERMS = ``;

  CONTENT.TC.DEFAULT_PLAN_URL = `/tc/storefront/happy-easter-funival.jsp`;
  CONTENT.EN.DEFAULT_PLAN_URL = `/en/storefront/happy-easter-funival.jsp`;

  CONTENT.TC.BG = 'IMG_V4/popup_banner/OSO_easter_campaign_2024/tc/easter_campaign_popup_banner_d_tc.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/OSO_easter_campaign_2024/tc/easter_campaign_popup_banner_m_tc.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/OSO_easter_campaign_2024/en/easter_campaign_popup_banner_d_en.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/OSO_easter_campaign_2024/en/easter_campaign_popup_banner_m_en.jpg';
  
  const easter = POPUP_BANNER.init({
	content: CONTENT,
	campaign: CAMPAIGN.EASTER,
	body: ` <a href="${UTIL.trans({
	  tc: CONTENT.TC.DEFAULT_PLAN_URL,
	  en: CONTENT.EN.DEFAULT_PLAN_URL,
	})}" class="bannerBody">
		  <div class="homePopup">
			  <div class="homePopup__row">
				  <div class="homePopup__col">
				  </div>
			  </div>
		  </div>
	  </a>`,
  });
  
  export default easter;
  