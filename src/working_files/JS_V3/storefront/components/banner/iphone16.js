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

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/apple/listing/iPhone/?itm_campaign=202410-ip16pro-popup&itm_source=itm&itm_medium=pop-up-banner&itm_content=OStore-iP-popup-tc&itm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/apple/listing/iPhone/?itm_campaign=202410-ip16pro-popup&itm_source=itm&itm_medium=pop-up-banner&itm_content=OStore-iP-popup-en&itm_ga=os";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/iPhone_16_Series_In_Stock_All_Models/iPhone_16_Series_In_Stock_All_Models_popup_TC.jpg';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/iPhone_16_Series_In_Stock_All_Models/iPhone_16_Series_In_Stock_All_Models_popup_mobTC.jpg';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/iPhone_16_Series_In_Stock_All_Models/iPhone_16_Series_In_Stock_All_Models_popup_EN.jpg';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/iPhone_16_Series_In_Stock_All_Models/iPhone_16_Series_In_Stock_All_Models_popup_mobEN.jpg';
  
  const iphone16 = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.IPHONE16,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default iphone16;
  