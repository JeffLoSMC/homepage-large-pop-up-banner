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

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/double11_2024.jsp?itm_campaign=20241101-1111offer&itm_source=itm&itm_medium=pop-up-banner&itm_content=OStore-popup-tc&itm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/double11_2024.jsp?itm_campaign=20241101-1111offer&itm_source=itm&itm_medium=pop-up-banner&itm_content=OStore-popup-en&itm_ga=os";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/Blackfriday_2024/Blackfriday_popbanner_d_tc02.gif';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/Blackfriday_2024/Blackfriday_popbanner_m_tc03.gif';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/Blackfriday_2024/Blackfriday_popbanner_d_tc02.gif';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/Blackfriday_2024/Blackfriday_popbanner_m_tc03.gif';
  
  const blackfriday2024 = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.BLACKFRIDAY2024,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default blackfriday2024;
  