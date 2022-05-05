var isMobile = {
    android: function() { return navigator.userAgent.match(/Android/i) ? true : false; },
    blackberry: function() { return navigator.userAgent.match(/BlackBerry/i) ? true : false; },
    ios: function() { return navigator.userAgent.match(/iPhone|iPod/i) ? true : false; },
    windows: function() { return navigator.userAgent.match(/IEMobile/i) ? true : false; },
    any: function() { return (isMobile.android() || isMobile.blackberry() || isMobile.ios() || isMobile.windows()); }
};