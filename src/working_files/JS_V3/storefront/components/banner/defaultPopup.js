import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';

  //default setting for OS storefront popup banner
  //develop view: 1024 x 470 px; mobile view: 232 x 420 px
  //update content by changing the following parameters and "campaign:" in init function
  //you may need to copy a new js file for specific banner with different css styles or extra buttons
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/christmas_2024.jsp?itm_campaign=202412-xmaxpop&itm_source=itm&itm_medium=pop-up-banner&itm_content=xmaspop-tc&itm_ga=os ";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/christmas_2024.jsp?itm_campaign=202412-xmaxpop&itm_source=itm&itm_medium=pop-up-banner&itm_content=xmaspop-en&itm_ga=os ";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/oso_christmas_2024/Christmas_popup_banner_d_tc.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/oso_christmas_2024/Christmas_popup_banner_m_tc.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/oso_christmas_2024/Christmas_popup_banner_d_en.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/oso_christmas_2024/Christmas_popup_banner_m_en.jpg';
  
  const defaultPopup = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.XMAS2024,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default defaultPopup;
  