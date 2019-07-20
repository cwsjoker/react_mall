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


// 过滤秒数
export function secondToDate(result) {
    const d = Math.floor(result / (3600 * 24)) < 10 ? '0' + Math.floor(result / (3600 * 24)) : Math.floor(result / (3600 * 24));
    const h = Math.floor(result / 3600 % 24) < 10 ? '0' + Math.floor(result / 3600 % 24) : Math.floor(result / 3600 % 24);
    const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = d + "天" + h + "时" + m + "分" + s + "秒";
}

// 过滤分钟
export function secondToDateMin(result) {
    if (result <= 0) {
        return '00天00时00分00秒';
    } else {
        const d = Math.floor(result / (60 * 24)) < 10 ? '0' + Math.floor(result / (60 * 24)) : Math.floor(result / (60 * 24));
        const h = Math.floor(result / 60 % 24) < 10 ? '0' + Math.floor(result / 60 % 24) : Math.floor(result / 60 % 24);
        const m = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
        let s = '';
        if (d === '00') {
            if (h === '00') {
                s = m + "分";
            } else {
                s = h + "时" + m + "分";
            }
        } else {
            s = d + "天" + h + "时" + m + "分";
        }
        return s;
    }
}
