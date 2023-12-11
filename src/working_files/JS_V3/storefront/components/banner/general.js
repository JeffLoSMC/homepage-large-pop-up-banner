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
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/samsung_mothers_day/samsung_mothers_day_popup_banner_tc.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/samsung_mothers_day/samsung_mothers_day_popup_banner_m_tc.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/samsung_mothers_day/samsung_mothers_day_popup_banner_en.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/samsung_mothers_day/samsung_mothers_day_popup_banner_m_en.jpg';
  
  const general = POPUP_BANNER.init({
	content: CONTENT,
	campaign: CAMPAIGN.DEFAULT,
	body: ` <a href="${UTIL.trans({
	  tc: CONTENT.TC.DEFAULT_PLAN_URL,
	  en: CONTENT.EN.DEFAULT_PLAN_URL,
	})}" class="bannerBody">
		  <div class="homePopup">
			  <div class="homePopup__row">
				  <div class="homePopup__col">
					  <div class="homePopup__text">
						  <div class="homePopup__terms" id="DEFAULT_TERMS">
							  ${UTIL.trans({
				  tc: CONTENT.TC.DEFAULT_TERMS,
				  en: CONTENT.EN.DEFAULT_TERMS,
				})}
						  </div>
					  </div>
				  </div>
			  </div>
		  </div>
	  </a>`,
  });
  
  export default general;
  