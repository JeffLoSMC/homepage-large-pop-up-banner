import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};
  
  CONTENT.TC.DEFAULT_TERMS = `優惠期至2022年5月15日，限量200張，先到先得。受條款及細則約束。`;
  CONTENT.EN.DEFAULT_TERMS = `Valid till 15 May 2022. 200 Quota Avaliable, First-Come-First-Served.T&Cs apply`;
  
  CONTENT.TC.DEFAULT_PLAN_URL = `/tc/storefront/Samsung.jsp?itm_campaign=20220429-mothersday-special&itm_source=online-store&itm_medium=popupbanner&itm_content=samsung-corner-page&itm_ga=os`;
  CONTENT.EN.DEFAULT_PLAN_URL = `/en/storefront/Samsung.jsp?itm_campaign=20220429-mothersday-special&itm_source=online-store&itm_medium=popupbanner&itm_content=samsung-corner-page&itm_ga=os`;
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/christmas/tc/Christmas_Campaign_PageBanner_V1_d_TC.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/christmas/tc/Christmas_Campaign_PageBanner_V1_m_TC.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/christmas/en/Christmas_Campaign_PageBanner_V1_d_EN.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/christmas/en/Christmas_Campaign_PageBanner_V1_m_EN.jpg';
  
  const christmas = POPUP_BANNER.init({
	content: CONTENT,
	campaign: CAMPAIGN.CHRISTMAS,
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
  
  export default christmas;
  