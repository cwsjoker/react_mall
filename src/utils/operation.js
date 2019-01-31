export function operateScript(producerId) {
    let src = '';
    switch(producerId) {
        case 1:
            src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=9ad9ba40-1ecd-11e9-81f8-31305fb19a44&autoShow=false&language=ZHCN'
            break;
        case 2:
            src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=c9933eb0-1ecd-11e9-81f8-31305fb19a44&autoShow=false&language=ZHCN'
            break;
        case 3:
            src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=eabe4da0-1ecd-11e9-81f8-31305fb19a44&autoShow=false&language=ZHCN'
            break;
        case 4:
            src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=5b1ec430-1ece-11e9-81f8-31305fb19a44&autoShow=false&language=ZHCN'
            break;
        case 5:
            src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=bf871cb0-1ece-11e9-81f8-31305fb19a44&autoShow=false&language=ZHCN'
            break;
        default:
            src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=9ad9ba40-1ecd-11e9-81f8-31305fb19a44&autoShow=false&language=ZHCN'
            break;
    }
    let s = document.createElement('script');
    s.src = src;
    s.async = 'async';
    document.head.appendChild(s);
}


 // 过滤html
export function unescapeHTML(a) {
    a = "" + a;
    return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}