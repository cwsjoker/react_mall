/**
 * 保留浮点数位数,自动补0
 * @param {*String Number 浮点数} v
 * @param {*Number 保留位数} n
 */
function decimal(v, n) {
    const type = typeof v;
    // 类型不是number 和 string的直接返回不处理
    if (type !== 'number' && type !== 'string') return;

    v = v.toString();
    // 如果n为0的话直接转化为整型
    if (n === 0) {
        return parseInt(v, 10);
    }

        if (v.split(".")[1]) {
        // 小数
        const num = n - v.split(".")[1].length;
        // 不够n位小数自动补0,超过去掉
        if (num > 0) {
            for (var i = 0; i < num; i++) {
                v = v + "0";
            }
        } else if (num < 0) {
            v = v.split(".")[0] + '.' + v.split(".")[1].substring(0, n);
        }
    } else {
        // 检测是否有小数点
        if (v.lastIndexOf('.') === -1) {
            v = v + '.'
        }
        for (var i = 0; i < n; i++) {
            v = v + '0'
        }
    }

    // if (v < 0) {
    //     v = 0.0;
    // }
    return v;
}


// 转化科学技术数字
function scientificToNumber(num) {
    var str = num.toString();
    var reg = /^(\d+(\.\d+)?)(e)([\-]?\d+)$/;
    var arr, len,
        zero = '';

    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
        return num;
    } else {
        /*6e-7 需要手动转换*/
        arr = reg.exec(str);
        // console.log(arr);
        len = Math.abs(arr[4]) - 1;
        // console.log(len);
        // console.log(Math.pow(10, digitLength(arr[1])));
        let k = Math.pow(10, digitLength(arr[1]));
        // 支持到10位小数
        if ( k >= 10000) {
            k = 10000;
        }
        for (var i = 0; i < len; i++) {
            zero += '0';
        }
        // console.log(strip(Number(arr[1])));
        return '0.' + zero + times(strip(Number(arr[1])), k);
    }
}

// 获取小数后面的位数,兼容科学记数法
function floatLength(num) {
    const val = num.toString();
    if (val.indexOf('e') === -1) {
        if (val.indexOf('.') === -1) {
            return 0;
        } else {
            return val.split(".")[1].length;
        }
    } else {
        // 科学记数
        const eSplit = val.toString().split(/[eE]/);
        const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
        return len;
    }
}

function round(num, ratio) {
    const base = Math.pow(10, ratio);
    return divide(Math.round(times(num, base)), base);
}

/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision));
}

/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num) {
    // Get digit length of e
    const eSplit = num.toString().split(/[eE]/);
    const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}

/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().replace('.', ''));
    }
    const dLen = digitLength(num);
    return dLen > 0 ? num * Math.pow(10, dLen) : num;
}

/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
function checkBoundary(num) {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        //   console.warn(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
    }
}

/**
 * 精确乘法
 */
function times(num1, num2, ...others) {
    if (others.length > 0) {
        return times(times(num1, num2), others[0], ...others.slice(1));
    }
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    const baseNum = digitLength(num1) + digitLength(num2);
    const leftValue = num1Changed * num2Changed;

    checkBoundary(leftValue);

    return leftValue / Math.pow(10, baseNum);
}

/**
 * 精确加法
 */
function plus(num1, num2, ...others) {
    if (others.length > 0) {
        return plus(plus(num1, num2), others[0], ...others.slice(1));
    }
    const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}

/**
 * 精确减法
 */
function minus(num1, num2, ...others) {
    if (others.length > 0) {
        return minus(minus(num1, num2), others[0], ...others.slice(1));
    }
    const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}

/**
 * 精确除法
 */
function divide(num1, num2, ...others) {
    if (others.length > 0) {
        return divide(divide(num1, num2), others[0], ...others.slice(1));
    }
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    return times((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
}

/**
 * 基准单位减法
 * @param {*String Number 浮点数} v
 * @param {*Precision 基准单位精度} n
 */
function reduceNum(transVal, precision) {
    // const n = floatLength(precision);
    return precision ? decimal(scientificToNumber(minus(Number(transVal), 1 / Math.pow(10, precision))), precision) : Number(transVal) - 1;
}

 /**
 * 基准单位加法
 * @param {*String Number 浮点数} v
 * @param {*Precision 保留位数} n
 */
function addNum(transVal, precision) {
    // const n = floatLength(precision);
    return precision ? decimal(scientificToNumber(plus(Number(transVal), 1 / Math.pow(10, precision))), precision) : Number(transVal) + 1;
}


export {
    decimal,
    scientificToNumber,
    floatLength,
    round,
    strip,
    digitLength,
    float2Fixed,
    times,
    plus,
    minus,
    divide,
    reduceNum,
    addNum
}