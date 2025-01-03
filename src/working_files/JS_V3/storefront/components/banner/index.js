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
  if (campaign == CAMPAIGN.CNYREWARDS) {
    ga('send', 'event', 'Homepage_large_pop_up_cnyRewards', 'Impression', 'Click_cnyRewards');
  }
  if (campaign == CAMPAIGN.EASTER) {
    ga('send', 'event', 'Homepage_large_pop_up_easter', 'Impression', 'Click_easter');
  }
  if (campaign == CAMPAIGN.MOTHER) {
    ga('send', 'event', 'Homepage_large_pop_up_mother', 'Impression', 'Click_mother');
  }
  if (campaign == CAMPAIGN.FATHER) {
    ga('send', 'event', 'Homepage_large_pop_up_father', 'Impression', 'Click_father');
  }
  if (campaign == CAMPAIGN.BACKTOSCHOOL) {
    ga('send', 'event', 'Homepage_large_pop_up_backToSchool', 'Impression', 'Click_backToSchool');
  }
  if (campaign == CAMPAIGN.FLIPFOLD) {
    ga('send', 'event', 'Homepage_large_pop_up_flipfold', 'Impression', 'Click_flipfold');
  }
  if (campaign == CAMPAIGN.IPHONE16) {
    ga('send', 'event', 'Homepage_large_pop_up_iphone16', 'Impression', 'Click_iphone16');
  }
  if (campaign == CAMPAIGN.DOUBLE11) {
    ga('send', 'event', 'Homepage_large_pop_up_double11', 'Impression', 'Click_double11');
  }
  //OSO-226
  if (campaign == CAMPAIGN.BLACKFRIDAY2024) {
    ga('send', 'event', 'Homepage_large_pop_up_blackfriday2024', 'Impression', 'Click_blackfriday2024');
  }
  //OSO-225
  if (campaign == CAMPAIGN.XMAS2024) {
    ga('send', 'event', 'Homepage_large_pop_up_xmas2024', 'Impression', 'Click_xmas2024');
  }
  //OSO-233
  if (campaign == CAMPAIGN.XMAS2024APPLE) {
    if (UTIL.locale() == 'EN') {
      ga('send', 'event', 'OS_POPUP_EN', 'Impression', '202412_OSPOPup_IM_en');
    } else {
      ga('send', 'event', 'OS_POPUP_TC', 'Impression', '202412_OSPOPup_IM_tc');
    }
  }
  //OSO-238
  if (campaign == CAMPAIGN.CNY2025ANDROID) {
    if (UTIL.locale() == 'EN') {
      ga('send', 'event', 'OS_pop_en', 'Impression', '202501_androidpop_CNY_IM');
    } else {
      ga('send', 'event', 'OS_pop_tc', 'Impression', '202501_androidpop_CNY_IM');
    }
  }
  if (campaign == CAMPAIGN.CNY2025APPLE) {
    if (UTIL.locale() == 'EN') {
      ga('send', 'event', 'OS_pop_en', 'Impression', '202501_applepop_CNY_IM');
    } else {
      ga('send', 'event', 'OS_pop_tc', 'Impression', '202501_applepop_CNY_IM');
    }
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
    if (campaign == CAMPAIGN.CNYREWARDS) {
      ga('send', 'event', 'Homepage_large_pop_up_cnyRewards', 'Click', 'First_Time_cnyRewards');
    }
    if (campaign == CAMPAIGN.EASTER) {
      ga('send', 'event', 'Homepage_large_pop_up_easter', 'Click', 'First_Time_easter');
    }
    if (campaign == CAMPAIGN.MOTHER) {
      ga('send', 'event', 'Homepage_large_pop_up_mother', 'Click', 'First_Time_mother');
    }
    if (campaign == CAMPAIGN.FATHER) {
      ga('send', 'event', 'Homepage_large_pop_up_father', 'Click', 'First_Time_father');
    }
    if (campaign == CAMPAIGN.BACKTOSCHOOL) {
      ga('send', 'event', 'Homepage_large_pop_up_backToSchool', 'Click', 'First_Time_backToSchool');
    }
    if (campaign == CAMPAIGN.FLIPFOLD) {
      ga('send', 'event', 'Homepage_large_pop_up_flipfold', 'Click', 'First_Time_flipfold');
    }
    if (campaign == CAMPAIGN.IPHONE16) {
      ga('send', 'event', 'Homepage_large_pop_up_iphone16', 'Click', 'First_Time_iphone16');
    }
    if (campaign == CAMPAIGN.DOUBLE11) {
      ga('send', 'event', 'Homepage_large_pop_up_double11', 'Click', 'First_Time_double11');
    }
    if (campaign == CAMPAIGN.BLACKFRIDAY2024) {
      ga('send', 'event', 'Homepage_large_pop_up_blackfriday2024', 'Click', 'First_Time_blackfriday2024');
    }
    if (campaign == CAMPAIGN.XMAS2024) {
      ga('send', 'event', 'Homepage_large_pop_up_xmas2024', 'Click', 'First_Time_xmas2024');
    }
    if (campaign == CAMPAIGN.XMAS2024APPLE) {
      if (UTIL.locale() == 'EN') {
        ga('send', 'event', 'OS_POPUP_EN', 'Click', '202412_OS_POPup_en');
      } else {
        ga('send', 'event', 'OS_POPUP_TC', 'Click', '202412_OS_POPup_tc');
      }
    }
    if (campaign == CAMPAIGN.CNY2025ANDROID) {
      if (UTIL.locale() == 'EN') {
        ga('send', 'event', 'OS_pop_en', 'Click', '202501_androidpop_CNY');
      } else {
        ga('send', 'event', 'OS_pop_tc', 'Click', '202501_androidpop_CNY');
      }
    }
    if (campaign == CAMPAIGN.CNY2025APPLE) {
      if (UTIL.locale() == 'EN') {
        ga('send', 'event', 'OS_pop_en', 'Click', '202501_applepop_CNY');
      } else {
        ga('send', 'event', 'OS_pop_tc', 'Click', '202501_applepop_CNY');
      }
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
