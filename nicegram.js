// Nicegram Pro 解锁脚本（适配 /api/v7/user/info，v6 同样兼容）
// 用法（QuantumultX [rewrite_local]，需 MITM nicegram.cloud）：
//   ^https:\/\/nicegram\.cloud\/api\/v\d+\/user\/info url script-response-body https://raw.githubusercontent.com/ultrasev/qx/master/nicegram.js
//
// 改动字段：
//   subscription / store_subscription / lifetime_subscription / subscriptionPlus -> true
//   gems_balance -> 10000000
// 不动的字段（动了会破坏登录/同步）：id, telegramAuthToken, telegramId, server_time 等

var body = $response.body;

try {
    var obj = JSON.parse(body);
    var user = obj && obj.data && obj.data.user;
    if (user) {
        user.subscription = true;
        user.store_subscription = true;
        user.lifetime_subscription = true;
        user.subscriptionPlus = true;
        user.gems_balance = 10000000;
        // showAds 服务端本来就返回 false，无需处理；如需强制可解开下一行
        // user.showAds = false;
        // 如需解锁敏感内容（18+）开关，解开下一行
        // user.sensitiveContentEnabled = true;
        body = JSON.stringify(obj);
    }
} catch (e) {
    console.log("nicegram.js parse error: " + e);
}

$done({ body });
