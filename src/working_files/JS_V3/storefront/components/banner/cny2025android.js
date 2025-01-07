import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "https://www.smartone.com/SmarTone-CARE/intro/tchinese/index.html?redirect=redpacket2025";
  CONTENT.EN.DEFAULT_PLAN_URL = "https://www.smartone.com/SmarTone-CARE/intro/english/index.html?redirect=redpacket2025";
  
  CONTENT.TC.BG = 'IMG_V4/popup_banner/cny2025_leisee/cny_popup_d_TC.gif';
  CONTENT.TC.BG_M = 'IMG_V4/popup_banner/cny2025_leisee/cny_popup_m_TC.gif';
  
  CONTENT.EN.BG = 'IMG_V4/popup_banner/cny2025_leisee/cny_popup_d_EN.gif';
  CONTENT.EN.BG_M = 'IMG_V4/popup_banner/cny2025_leisee/cny_popup_m_EN.gif';
  
  const cny2025android = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.CNY2025ANDROID,
    body: ` <a href="${UTIL.trans({
      tc: CONTENT.TC.DEFAULT_PLAN_URL,
      en: CONTENT.EN.DEFAULT_PLAN_URL,
    })}" class="bannerBody">
        <div class="homePopup">
        </div>
      </a>`,
  });
  
  export default cny2025android;
  