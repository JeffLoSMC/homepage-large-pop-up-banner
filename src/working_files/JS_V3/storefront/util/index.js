import { LOCALE_TC } from '../constant';
import ASSIST from '../assist';

const UTIL = {};

UTIL.getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

UTIL.locale = () => {
  return ASSIST.getLangSEO();
};

UTIL.trans = ({ tc, en }) => {
  if (ASSIST.getLangSEO() == LOCALE_TC) {
    return tc;
  } else {
    return en;
  }
};

UTIL.imgPath = (fileName) => {
  const url = window.location;
  const env = UTIL.getParameterByName('env');
  const domain = env && url.hostname === 'localhost' ? env : url.origin + '/';
  return `${domain + fileName}`;
};

UTIL.copyToClipboard = (text) => {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text);
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

export default UTIL;
