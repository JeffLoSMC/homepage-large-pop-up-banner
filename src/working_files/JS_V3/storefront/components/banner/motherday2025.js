import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';

  //default setting for OS storefront popup banner when there are two banner versions
  //develop view: 1024 x 470 px; mobile view: 232 x 420 px
  //update content by changing the following parameters and "campaign:" in init function
  //you may need to copy a new js file for specific banner with different css styles or extra buttons
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = "/tc/storefront/Mothers_day_2025.jsp?itm_campaign=202504-mothers-day-os-popup&itm_source=smartone-onlinestore&itm_medium=banner&itm_content=tc&itm_ga=os";
  CONTENT.EN.DEFAULT_PLAN_URL = "/en/storefront/Mothers_day_2025.jsp?itm_campaign=202504-mothers-day-os-popup&itm_source=smartone-onlinestore&itm_medium=banner&itm_content=en&itm_ga=os";
  
  
  const motherday2025 = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.MOTHERDAY2025,
    body: `
      <a href="${UTIL.trans({
          tc: CONTENT.TC.DEFAULT_PLAN_URL,
          en: CONTENT.EN.DEFAULT_PLAN_URL,
      })}" class="bannerBody">
        <div id="animation_container">
          <canvas id="canvas"></canvas>
          <div id="dom_overlay_container"></div>
        </div>
        <div class="homePopup"></div>
      </a>
    `,
  });
  
  export default motherday2025;
  