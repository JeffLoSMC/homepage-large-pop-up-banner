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
  
  CONTENT.TC.DEFAULT_PLAN_URL = `/tc/storefront/samsung-cny-rewards-week_2024.jsp?itm_campaign=20240201-cny-samsung-os-pop&itm_source=smartone-onlinestore&itm_medium=banner&itm_content=tc&itm_ga=os`;
  CONTENT.EN.DEFAULT_PLAN_URL = `/en/storefront/samsung-cny-rewards-week_2024.jsp?itm_campaign=20240201-cny-samsung-os-pop&itm_source=smartone-onlinestore&itm_medium=banner&itm_content=en&itm_ga=os`;

  CONTENT.TC.BG = 'IMG_V4/popup_banner/CNY_Vday_samsung/tc/CNY_Vday_samsung_banner_d.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/CNY_Vday_samsung/tc/CNY_Vday_samsung_banner_m.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/CNY_Vday_samsung/en/CNY_Vday_samsung_banner_d.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/CNY_Vday_samsung/en/CNY_Vday_samsung_banner_m.jpg';
  
  const cnyRewards = POPUP_BANNER.init({
	content: CONTENT,
	campaign: CAMPAIGN.CNYREWARDS,
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
  
  export default cnyRewards;
  