export function shortenAddress(address) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte'; // eslint-disable-line eqeqeq
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function weiToEther(number) {
  return number / 1000000000000000000;
}

export function weiToGwei(number) {
  return number / 1000000000;
}

export function isNumber(n) {
  return !isNaN(Number(n));
}

export function scrollToTop() {
  const pageBody = document.getElementsByClassName('page-body')[0];
  if (pageBody.scrollTo) {
    pageBody.scrollTo(0, 0);
  } else {
    pageBody.scrollTop = 0;
  }
}

export function currentRouteSelector(pathname) {
  return pathname.split('/')[1] || '';
}

export function downloadFile(sUrl) {
  const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
  if (/(iP)/g.test(navigator.userAgent)) {
    window.open(sUrl, '_blank');
    return false;
  }

  if (isChrome || isSafari) {
    var link = document.createElement('a');
    link.href = sUrl;
    link.setAttribute('target', '_blank');

    if (link.download !== undefined) {
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
      link.download = fileName;
    }

    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }

  if (sUrl.indexOf('?') === -1) {
    sUrl += '?download';
  }

  window.open(sUrl, '_blank');
  return true;
};
