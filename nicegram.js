// Nicegram Pro 解锁 + 去广告脚本（适配 /api/v7，兼容任意版本号）
// 用法（QuantumultX [rewrite_local]，需 MITM nicegram.cloud）：
//   ^https:\/\/nicegram\.cloud\/api\/v\d+\/user\/info url script-response-body https://raw.githubusercontent.com/ultrasev/qx/master/nicegram.js
//   ^https:\/\/nicegram\.cloud\/api\/v\d+\/att\/scroll-to-earn\/user-info url script-response-body https://raw.githubusercontent.com/ultrasev/qx/master/nicegram.js
//
// user/info：subscription/store_subscription/lifetime_subscription/subscriptionPlus -> true，
//            gems_balance -> 10000000；身份字段（id/telegramAuthToken/telegramId 等）不动
// scroll-to-earn/user-info：enabledAds -> false，placementSettings 全部广告位 -> false，
//            collectUserActions -> false（关跟踪）
// ai-assistant/open-router/get-info：balance -> 10000000（仅显示，实际调用服务端计费）

var body = $response.body;

try {
  var obj = JSON.parse(body);
  var data = obj && obj.data;

  if (/\/att\/scroll-to-earn\/user-info/.test($request.url)) {
    // 去广告：广告总开关 + 6 个广告位 + 行为跟踪
    if (data) {
      data.enabledAds = false;
      data.enableCoinAnimation = false;
      data.collectUserActions = false;
      var ps = data.placementSettings;
      if (ps && ps.length) {
        for (var i = 0; i < ps.length; i++) ps[i].enabled = false;
      }
    }
  } else if (/\/ai-assistant\/open-router\/get-info/.test($request.url)) {
    // AI 助手余额
    if (data) data.balance = 10000000;
  } else {
    // Pro 解锁
    var user = data && data.user;
    if (user) {
      user.subscription = true;
      user.store_subscription = true;
      user.lifetime_subscription = true;
      user.subscriptionPlus = true;
      user.gems_balance = 10000000;
      // 如需解锁敏感内容（18+）开关，解开下一行
      // user.sensitiveContentEnabled = true;
    }
  }

  body = JSON.stringify(obj);
} catch (e) {
  console.log("nicegram.js parse error: " + e);
}

$done({ body });



