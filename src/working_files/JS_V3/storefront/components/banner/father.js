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

  CONTENT.TC.DEFAULT_PLAN_URL = `/tc/storefront/fatherday2024.jsp?itm_campaign=20240604-fathersday-pop&itm_source=smartone-onlinestore&itm_medium=banner&itm_content=tc&itm_ga=os`;
  CONTENT.EN.DEFAULT_PLAN_URL = `/en/storefront/fatherday2024.jsp?itm_campaign=20240604-fathersday-pop&itm_source=smartone-onlinestore&itm_medium=banner&itm_content=en&itm_ga=os`;

  CONTENT.TC.BG = 'IMG_V4/popup_banner/Fathersday_2024/fathers2024_day_campaign_popup_banner_TC.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/Fathersday_2024/fathers2024_day_campaign_popup_banner_m_TC.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/Fathersday_2024/fathers2024_day_campaign_popup_banner_EN.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/Fathersday_2024/fathers2024_day_campaign_popup_banner_m_EN.jpg';
  
  const father = POPUP_BANNER.init({
	content: CONTENT,
	campaign: CAMPAIGN.FATHER,
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
  
  export default father;
  