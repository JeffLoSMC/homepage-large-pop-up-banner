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

  CONTENT.TC.BG = 'IMG_V4/popup_banner/back_to_school_2024/backtoschool_popbanner_d_TC.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/back_to_school_2024/backtoschool_popbanner_m_TC.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/back_to_school_2024/backtoschool_popbanner_d_EN.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/back_to_school_2024/backtoschool_popbanner_m_EN.jpg';
  
  const backToSchool = POPUP_BANNER.init({
	content: CONTENT,
	campaign: CAMPAIGN.BACKTOSCHOOL,
	body: ` <a href="${UTIL.trans({
	  tc: CONTENT.TC.DEFAULT_PLAN_URL,
	  en: CONTENT.EN.DEFAULT_PLAN_URL,
	})}" class="bannerBody">
		  <div class="homePopup">
		  </div>
	  </a>`,
  });
  
  export default backToSchool;
  