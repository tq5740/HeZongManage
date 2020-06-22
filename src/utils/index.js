import All from "@api/all";

/**
 *
 * @param obj 需要冻结的对象或者数组
 */
export function deepFreeze(obj) {

    // 取回定义在obj上的属性名
    var propNames = Object.getOwnPropertyNames(obj);

    // 在冻结自身之前冻结属性
    propNames.forEach(function(name) {
        var prop = obj[name];

        // 如果prop是个对象，冻结它
        if (typeof prop == 'object' && prop !== null)
        deepFreeze(prop);
    });

    // 冻结自身(no-op if already frozen)
    return Object.freeze(obj);
}
/**
 *
 * @param arr 过滤空值
 */
export function arrFilter(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == null) {
            arr.splice(i, 1);
            i = i - 1;
        }
    }
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) < 0) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

/**
 *
 * @param name 缓存的KEY
 * @param data 缓存的数据
 */
export function setStorage(name, data) {
    try {
        window.sessionStorage.setItem("session_test", "ok");
    } catch (_) {
        alert("请关闭无痕模式以便正常使用功能");
        return false;
    }
    if (!name) return;
    window.sessionStorage.setItem(name, JSON.stringify(data));
}

/**
 *
 * @param name 缓存的名字
 * @param isPure 是否需要 JSONParse
 */
export function getStorage(name, isPure = false) {
    if (!name) return;
    if (isPure) return window.sessionStorage.getItem(name);
    var data = window.sessionStorage.getItem(name);
    if (data && data !== "null" && data !== "undefined") {
        return JSON.parse(data)
    } else {
        return null
    }
}

export function removeStorage(name) {
    if (!name) return;
    window.sessionStorage.removeItem(name);;
}

/**
 *
 * @param code 被查找id
 * @param arr 被查找数组
 *
 */
export function mapStr(code, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].code == code) {
            return arr[i].name;
        }
    }
    return "-";
}
/**
 *
 * @param name 被查找图表select
 * @param arr 被查找数组
 * @param num 被查找图表第几个select
 *
 */
export function mapSelect(name, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == name) {
            return arr[i].arr;
        }
    }
    return [];
}
/**
 *
 * @param timeStr yyyy-mm-dd hh:mm:ss
 *
 */
export function getTimeStamp(timeStr) {
    var dateStr = timeStr.replace(/-/g, "/");
    return +new Date(dateStr);
}

/**
 *
 * @param time 时间戳
 * @param format 需要格式的类型 `YYYY-MM-DD h:m:s` `YYYY-MM-DD` `h:m:s`等
 */
export function formatDate(time, fmt = `YYYY-MM-DD hh:mm:ss`) {
    var date = new Date(time);
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    var o = {
        "M+": date.getMonth() + 1,
        "D+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };

    for (var i in o) {
        if (new RegExp("(" + i + ")").test(fmt)) {
            var str = o[i] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : str.padLeft("0", 2)
            );
        }
    }
    return fmt;
}

/**
 *
 * @param a 秒
 */
export function formatSeconds(a) {
    if (a != null) {
        var hh = Math.floor(a / 3600);
        var mm = Math.floor((a - hh * 3600) / 60);
        var ss = Math.floor((a - hh * 3600) % 60);
        var length = (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss);
        if (a > 0) {
            return length;
        } else {
            return "00:00:00";
        }
    } else {
        return "00:00:00";
    }
}
/**
 *
 * @param allTree 需要遍历的树
 * @param name value对应的名
 * @param title label对应的数据
 * @param initArr 最终处理好的树
 */
export function forTree(allTree, name, title, initArr = []) {
    if (allTree && allTree.length > 0) {
        allTree.forEach((i, k) => {
            initArr.push({
                value: i[name],
                label: i[title],
                children: i.length === 0 ? null : [],
                parentId: i.parentId,
                title: i[name],
                hierarchy: i.hierarchy || "",
                type: i.type
            });
            if (initArr[k].children !== null) {
                forTree(i.children, name, title, initArr[k].children);
            }
        });
    }
    return [...initArr];
}

export function getIsCheckArr(allArr, lastArr = [], arr = []) {
    //循环列表
    if (allArr.length > 0) {
        allArr.forEach((i, k) => {
            arr.push({
                children: [],
                methodId: i.methodId
            });

            if (i.isCheck) {
                if (i.children.length === 0) {
                    lastArr.push(i.methodId);
                }
                if (arr[k]) {
                    getIsCheckArr(i.children, lastArr, arr[k].children);
                }
            }
        });
    }
    return lastArr;
}


export function getApiTime(dateStr) {
    let str;
    if (dateStr.indexOf(" ") != -1) {
        str = dateStr.split(" ")[0];
    } else {
        str = dateStr
    }
    return str.replace(/-|\//g, "");
}

export function dateDifference(faultDate, completeTime) {
    var stime = new Date(faultDate).getTime();
    var etime = new Date(completeTime).getTime();
    var usedTime = etime - stime;
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    var leave1 = usedTime % (24 * 3600 * 1000);
    var hours = Math.floor(leave1 / (3600 * 1000));
    // var leave2 = leave1 % (3600 * 1000);
    // var minutes = Math.floor(leave2 / (60 * 1000));
    var time = [days, hours];
    // var time = days;
    return time;
}

/**
 *
 * @param str 纯数字
 */
export function checkNum(str) {
    return /^[0-9]*$/.test(str);
}
/**
 *
 * @param str 手机号
 */
export function mobileReg(str) {
    return /^[0-9]\d{10}$/.test(str);
}

/**
 *
 * @param str 邮箱号
 */
export function emailReg(str) {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(str);
}


/**
 *
 * @param num 数字每隔3个加逗号
 */
export function toThousands(num, is = false) {
    num = (num || 0).toString();
    let number = 0,
        floatNum = '',
        intNum = '';
    // 判断是否有小数位，有则截取小数点后的数字
    if (num.indexOf('.') > 0) {
        number = num.indexOf('.'); // 获取小数点出现的位置
        floatNum = num.substr(number, 3); // 截取arr.substr(form, length) 保留2位小数
        intNum = num.substring(0, number); // 截取arr.substring(start, end)
    } else {
        intNum = num;
    }
    let result = [],
        counter = 0;
    intNum = intNum.split('');
    // 利用3的倍数，向数组插入','
    for (let i = intNum.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(intNum[i]);
        if (!(counter % 3) && i != 0 && intNum[i - 1] != "-") {
            result.unshift(',');
        }
    }
    if (floatNum === '') {
        if (is) {
            return result.join('');
        } else {
            return result.join('') + ".00";
        }
    }
    return result.join('') + (floatNum != '' && floatNum.length < 3 ? floatNum + '0' : floatNum);
}

/**
 *
 * @param time 待插入的时间
 * @param str 符号
 */
export function toTime(time, str = "-") {
    time = (time || 0).toString();
    if (time.indexOf("-") != -1 || time.length === 4) {
        return time
    } else {
        if (time.length === 6) {
            return time.substr(0, 4) + str + time.substr(4, 2)
        } else if (time.length === 8) {
            return time.substr(0, 4) + str + time.substr(4, 2) + str + time.substr(6, 2)
        } else if (time.length === 10) {
            return time.substr(0, 4) + str + time.substr(4, 2) + str + time.substr(6, 2) + " " + time.substr(8, 2) + ":00"
        }
    }

}
// 图表单位计算
export function chartFormatter(res, is = false) {
    let str = "";
    let unit = "";
    res.forEach(i => {
        let text = i.seriesName;
        if (text.indexOf("率") !== -1 && text.indexOf("效率") === -1) {
            unit = "%";
        } else if (text.indexOf("整件") !== -1 || text.indexOf("件数量") !== -1) {
            unit = "件";
        } else if (text.indexOf("散件") !== -1) {
            unit = "条目";
        } else if (text.indexOf("箱") !== -1) {
            unit = "箱";
        } else if (text.indexOf("人") !== -1) {
            unit = "人";
        } else if (text.indexOf("数") !== -1) {
            unit = "个";
        } else if (text.indexOf("单量") !== -1) {
            unit = "单";
        } else if (text.indexOf("价") !== -1 || text.indexOf("额") !== -1 || text.indexOf("款") !== -1 || text.indexOf("税") !== -1) {
            unit = "元";
        } else if (text.indexOf("破损率") !== -1) {
            unit = "‱";
        } else {
            unit = ""
        }
        if (text.indexOf("数") !== -1) {
            str = `${str ? str + '<br>' : ''}<div style="background: ${i.color}" class="chart-dot"></div>${text ? text + "：" : text}${this.$ToThousands(i.value, true) + unit}`;
        } else {
            if (Object.prototype.toString.call(i.data) === '[object Object]' && "per" in i.data) {
                str = `${str ? str + '<br>' : ''}<div style="background: ${i.color}" class="chart-dot"></div>${text ? text + "：" : text}${this.$ToThousands(i.value, is)}(${i.data.per}%)`;
            } else if (Object.prototype.toString.call(i.data) === '[object Object]' && "dimension" in i.data) {
                str = `${str ? str + '<br>' : ''}<div style="background: ${i.color}" class="chart-dot"></div>${text ? text + "：" : text}${this.$ToThousands(i.value, is) + unit}`;
            } else {
                str = `${str ? str + '<br>' : ''}<div style="background: ${i.color}" class="chart-dot"></div>${text ? text + "：" : text}${this.$ToThousands(i.value, is) + unit}`;
            }
        }
    })
    return `${res[0].name} <br> ${str}`;
}
// 获取字符串某个字符的个数
export function getStrCount(scrstr, armstr) { //scrstr 源字符串 armstr 特殊字符
    var count = 0;
    while (scrstr.indexOf(armstr) != -1) {
        scrstr = scrstr.replace(armstr, "")
        count++;
    }
    return count;
}

export function getDaysBefore(
    is = false,
    date = new Date(),
    d = 90
) {
    var timestamp, newDate;
    if (!(date instanceof Date)) {
        date = new Date(date.replace(/-/g, "/"));
    }
    timestamp = date.getTime();
    newDate = new Date(timestamp - d * 24 * 3600 * 1000);
    var t = is ? [
        [
            newDate.getFullYear() + "/",
            (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) + "/" : (newDate.getMonth() + 1) + "/",
            newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()
        ].join("")
    ].join(" ") : [
        newDate.getFullYear(),
        (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
        newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()
    ].join("");
    // console.log(t)
    return t;
}
// getDaysBefore();


// 获得某年某月的天数
export function getMonthDays(myYear = new Date().getFullYear(), myMonth) {
    var now = new Date();
    var monthStartDate = new Date(myYear, myMonth, 1);
    var monthEndDate = new Date(myYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}


// get下载
export function getDownload(method, params) {
    const {href} = this.$router.resolve({
        path: All.http().router,
        query: {
          method: method,
          params: JSON.stringify(params),
          v: "V1.0.0",
          appKey: "00001"
        }
      });
      console.log(href);
      let src;
      src = All.http().router + href.substring(href.indexOf('?', href.lenght));
      console.log(src);
      window.open(src, '_self');
}