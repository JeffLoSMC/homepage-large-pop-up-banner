import { LOCALE_TC, CAMPAIGN } from '../constant';
import ASSIST from '../assist';
import UTIL from '../util';

const MODAL = {};

MODAL.$imgWithWrapper = function ({ tc = '', en = '', className = '', common = '' }) {
  const $img = (path) => `<div class="${className}"><img src="${UTIL.imgPath(path)}" /></div>`;
  if (common) {
    return $img(common);
  }
  if (ASSIST.getLangSEO() == LOCALE_TC) {
    return $img(tc);
  } else {
    return $img(en);
  }
};

MODAL.backgroundController = (campaign) => {
  let background = {
    desktop: 'DEFAULT_BG',
    mobile: 'DEFAULT_BG_M',
  };
  if (campaign == CAMPAIGN.FREQ_VISIT) {
    background = {
      desktop: 'BG',
      mobile: 'BG_M',
    };
  }
  return background;
};

// DIRTY
MODAL.bgConfig = function ({ desktop, mobile, campaign, content }) {
  return {
    img: UTIL.imgPath(content[UTIL.locale()][jQuery(window).outerWidth() > 768 ? desktop : mobile]),
    bgID: jQuery(window).outerWidth() > 768 ? desktop : mobile,
  };
};

MODAL.$closeBtn = jQuery(`<button type="button" class="close-btn">
	<div class="cross-box"></div>
</button>`);

MODAL.$modal = ({ body, background }) => {
  console.log('BG here', background);
  const _bgConfig = MODAL.bgConfig(background);
  const _id = background.campaign + '_' + _bgConfig.bgID;
  return jQuery(
    `<div id="bannerModal" class="modal modal-box" style="display: none">
				<div id=${_id} class="modal-content modal-content--popup-banner bannerBackground" style="background-image: url('${_bgConfig.img}')">
					<div class="modal-header">
						<div class="closeContainer">
						</div>
					</div>
					<div class="modal-body">
						${body}
					</div>
				</div>
		</div>
		<div id="bannerModal-backdrop" class="modal-backdrop show"></div>`
  );
};

export default MODAL;
