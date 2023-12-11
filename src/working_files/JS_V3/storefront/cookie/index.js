const COOKIES = {};

COOKIES.get = (name) => {
  const url = window.location;
  function escape(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
  }
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)')) && url.host == 'shop.smartone.com';
  return match ? document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'))[1] : null;
};

COOKIES.set = (name, key) => {
  const now = new Date();
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  document.cookie = `${name}=${key};expires=${nextDay.toUTCString()}`;
};

export default COOKIES;
