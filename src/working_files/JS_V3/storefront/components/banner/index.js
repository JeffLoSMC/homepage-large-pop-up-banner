import { CAMPAIGN, PROMO_CODE, COOKIES_NAME } from '../../constant';
import UTIL from '../../util';
import MODAL from '../../modal';
import COOKIES from '../../cookie';
import ASSIST from '../../assist';

const POPUP_BANNER = {};

POPUP_BANNER.render = (options) => {
  const { $modal, delay, campaign, content } = options;
  const _delay = !!delay ? delay : 0;
  if (campaign == CAMPAIGN.DEFAULT) {
    ga('send', 'event', 'Homepage_large_pop_up_samsung_mothersday_special', 'Impression', 'Click_samsung_mothersday_special');
  }
  if (campaign == CAMPAIGN.CHRISTMAS) {
    ga('send', 'event', 'Homepage_large_pop_up_christmas', 'Impression', 'Click_christmas');
  }
  jQuery('body').append($modal);
  POPUP_BANNER.registerEvent($modal, campaign, content);
  setTimeout(() => {
    jQuery('#bannerModal').fadeIn(500);
  }, _delay);
};

POPUP_BANNER.registerEvent = ($modal, campaign, content) => {
  $modal
    .find('.closeContainer')
    .append(MODAL.$closeBtn)
    .on('click', () => {
      jQuery('#bannerModal, #bannerModal-backdrop').fadeOut(200).remove();
    });
  $modal.find('.homePopup__copy-btn').on('click', function () {
    try {
      UTIL.copyToClipboard(content.PROMO_CODE);
      jQuery(this).text(
        UTIL.trans({
          tc: content.TC.COPIED,
          en: content.EN.COPIED,
        })
      );
    } catch (error) {
      console.log('copy fail' + error);
    }
    return false;
  });
  $modal.find('.bannerBody').on('click', () => {
    if (campaign == CAMPAIGN.DEFAULT) {
      ga('send', 'event', 'Homepage_large_pop_up_samsung_mothersday_special', 'Click', 'First_Time_samsung_mothersday_special');
    }
    if (campaign == CAMPAIGN.CHRISTMAS) {
      ga('send', 'event', 'Homepage_large_pop_up_christmas', 'Click', 'First_Time_christmas');
    }
  });
  window.onresize = function () {
    const _backgroundSet = {
      desktop: 'BG',
      mobile: 'BG_M',
      content,
    };
    const _bgConfig = MODAL.bgConfig(_backgroundSet);
    const _id = campaign + '_' + _bgConfig.bgID;
    console.log(_bgConfig.img);
    $modal
      .find('.bannerBackground')
      .css('backgroundImage', function () {
        return 'url(' + _bgConfig.img + ')';
      })
      .attr('id', _id);
  };
};

POPUP_BANNER.isNotReachCountOfShow = (number) => {
  const _count = COOKIES.get(COOKIES_NAME);
  return _count == null || parseInt(_count) < number;
};

POPUP_BANNER.addCountOfShow = (number) => {
  const _countFromCookies = COOKIES.get(COOKIES_NAME);
  const _count = _countFromCookies != null ? parseInt(_countFromCookies) + number : 1;
  COOKIES.set(COOKIES_NAME, _count);
};


POPUP_BANNER.isExist = () => {
  return jQuery('#bannerModal').length != 0
}

POPUP_BANNER.init =
  ({ body, campaign, content }) =>
  ({ rendered }) => {    
    //check has init
    if(POPUP_BANNER.isExist()) {
      return;
    }
    // DIRTY
    const background = {
      desktop: 'BG',
      mobile: 'BG_M',
      campaign,
      content,
    };
    POPUP_BANNER.render({
      campaign,
      content,
      delay: 1000,
      $modal: MODAL.$modal({
        body,
        background,
      }),
    });
    if (typeof rendered === 'function') {
      rendered();
    }
  };

export default POPUP_BANNER;
