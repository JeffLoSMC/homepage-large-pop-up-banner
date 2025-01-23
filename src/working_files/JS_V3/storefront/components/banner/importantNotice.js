import {
	CAMPAIGN
  } from '../../constant';
  import POPUP_BANNER from './index';
  import UTIL from '../../util';

  //setting for OS storefront important notice, e.g. working hours special arrangements, alert
  //develop view: 1024 x 470 px; mobile view: 232 x 420 px
  
  const CONTENT = {};
  
  CONTENT.TC = {};
  CONTENT.EN = {};
  CONTENT.IMAGE = {};

  CONTENT.TC.DEFAULT_PLAN_URL = ``;
  CONTENT.EN.DEFAULT_PLAN_URL = ``;
  
  CONTENT.TC.BG = ``;
  CONTENT.TC.BG_M = ``;
  
  CONTENT.EN.BG = ``;
  CONTENT.EN.BG_M = ``;

  CONTENT.TC.TITLE = `<p>農曆新年期間門市營業時間特別安排</p>`;
  CONTENT.EN.TITLE = `<p>Special arrangements on the operation hours of our stores during the "Chinese New Year" period</p>`;

  CONTENT.TC.DESC = `
    <p>農曆新年期間，門市營業時間安排如下：</p>
    <p>
      1月29日（年初一）&nbsp; &nbsp; &nbsp; &nbsp; 休息
      <br/>
      1月30日（年初二）&nbsp; &nbsp; &nbsp; &nbsp; 正午12時至晚上6時
      <br/>
      1月31日（年初三）&nbsp; &nbsp; &nbsp; &nbsp; 正常營業時間
    </p>
  `;
  CONTENT.EN.DESC = `
    <p>The business hours of SmarTone stores will be adjusted during the Chinese New Year holidays as follows:</p>
    <p>
      29<sup>th</sup>&nbsp;January (the first day of CNY)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Closed
      <br/>
      30<sup>th</sup>&nbsp;January (the second day of CNY)&nbsp;&nbsp;&nbsp;12:00 pm to 6:00 pm
      <br/>
      31<sup>st</sup>&nbsp;January (the third day of CNY)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Normal business hours
    </p>
  `;



  const importantNotice = POPUP_BANNER.init({
    content: CONTENT,
    campaign: CAMPAIGN.IMPORTANTNOTICE,
    body: ` 
      <div class="bannerBody">
        <div class="homePopup">
          <div class="noticeSectionBox">
            <div class="noticeSection">
              <div class="noticeSection__title">
                ${UTIL.trans({
                  tc: CONTENT.TC.TITLE,
                  en: CONTENT.EN.TITLE,
                })}
              </div>

              <div class="noticeSection__desc">
                ${UTIL.trans({
                  tc: CONTENT.TC.DESC,
                  en: CONTENT.EN.DESC,
                })}
              </div>
            </div>
          </div>
        </div>
      </a>`,
  });
  
  export default importantNotice;
  