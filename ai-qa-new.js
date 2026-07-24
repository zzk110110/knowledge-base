// ============================================================
// ai-qa-new.js — AI 智能问答（通过 CloudBase SDK 调用云函数）
// ============================================================

// ===== 配置区 =====
var CONFIG = {
  // API Key 已移至云函数环境变量
  systemPrompt: '你是华北电力大学氢能科学与工程专业的智能助手。请基于已有知识回答用户问题，回答要简洁准确。如果不知道就说不知道，不要编造。'
};

// ===== 以下代码不需要修改 =====
(function() {
  var s = document.createElement('style');
  s.textContent = '#ai-qa-toggle{position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#1a5a8c,#0a2a4a);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(26,58,92,0.35);font-size:26px;display:flex;align-items:center;justify-content:center;z-index:10000;transition:transform 0.2s,box-shadow 0.2s}#ai-qa-toggle:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(26,58,92,0.45)}#ai-qa-toggle:active{transform:scale(0.95)}#ai-qa-panel{position:fixed;bottom:100px;right:30px;width:380px;max-width:calc(100vw - 60px);max-height:70vh;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.18);z-index:10001;display:none;flex-direction:column;overflow:hidden;border:1px solid #dce4ed;font-family:Times New Roman,\u5b8b\u4f53,SimSun,serif}#ai-qa-panel.open{display:flex}#ai-qa-header{background:linear-gradient(135deg,#1a5a8c,#0a2a4a);color:#fff;padding:16px 20px;font-size:16px;font-weight:700;display:flex;justify-content:space-between;align-items:center;letter-spacing:1px}#ai-qa-header .close-btn{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:0 4px;line-height:1;opacity:0.8}#ai-qa-header .close-btn:hover{opacity:1}#ai-qa-header .subtitle{font-size:12px;font-weight:400;opacity:0.8;margin-top:2px}#ai-qa-messages{flex:1;overflow-y:auto;padding:16px 18px;background:#f7f9fc;min-height:200px;max-height:400px}#ai-qa-messages::after{content:"";display:table;clear:both}#ai-qa-messages .msg{margin-bottom:14px;max-width:90%}#ai-qa-messages .msg.user{text-align:right}#ai-qa-messages .msg.bot{text-align:left}#ai-qa-messages .msg .bubble{display:inline-block;padding:10px 16px;border-radius:14px;font-size:15px;line-height:1.6;word-wrap:break-word;box-shadow:0 1px 4px rgba(0,0,0,0.06);max-width:85%;text-align:left}#ai-qa-messages .msg.user .bubble{background:#1a5a8c;color:#fff;border-bottom-right-radius:4px}#ai-qa-messages .msg.bot .bubble{background:#fff;color:#1e2a3a;border:1px solid #dce4ed;border-bottom-left-radius:4px}#ai-qa-messages .msg.bot .bubble a{color:#1a5a8c;text-decoration:underline}#ai-qa-messages .typing .bubble{background:#fff;border:1px solid #dce4ed;border-bottom-left-radius:4px;color:#8a9aa8;font-style:italic}#ai-qa-input-area{display:flex;padding:12px 16px;border-top:1px solid #e2e9f2;background:#fff;gap:8px}#ai-qa-input-area input{flex:1;padding:10px 14px;border:2px solid #dce4ed;border-radius:24px;font-size:15px;outline:none;font-family:inherit;transition:border-color 0.2s}#ai-qa-input-area input:focus{border-color:#1a5a8c}#ai-qa-input-area button{padding:10px 20px;border:none;border-radius:24px;background:linear-gradient(135deg,#1a5a8c,#0a2a4a);color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit}#ai-qa-input-area button:hover{opacity:0.9}@media(max-width:480px){#ai-qa-panel{right:10px;bottom:90px;width:calc(100vw - 20px);max-height:75vh}#ai-qa-toggle{right:16px;bottom:16px;width:54px;height:54px;font-size:22px}}';
  document.head.appendChild(s);

  var btn = document.createElement('button');
  btn.id = 'ai-qa-toggle'; btn.innerHTML = '\u{1F4AC}';
  btn.setAttribute('aria-label', 'AI Q&A');
  document.body.appendChild(btn);

  var panel = document.createElement('div');
  panel.id = 'ai-qa-panel';
  panel.innerHTML = '<div id="ai-qa-header"><div><div>\u{1F916} AI \u667A\u80FD\u95EE\u7B54<small style="font-weight:400;margin-left:8px;font-size:12px;opacity:0.7;">\u{1F7E2} \u963F\u91CC\u4E91\u767E\u70BC</small></div><div class="subtitle">\u534E\u5317\u7535\u529B\u5927\u5B66 \u00B7 \u6C22\u80FD\u79D1\u5B66\u4E0E\u5DE5\u7A0B</div></div><button class="close-btn">\u2715</button></div><div id="ai-qa-messages"><div class="msg bot"><div class="bubble">\u4F60\u597D\uFF01\u6211\u662F\u6C22\u80FD\u4E13\u4E1A\u5C0F\u52A9\u624B \u{1F9D1}\u{1F52C}<br>\u4F60\u53EF\u4EE5\u95EE\u6211\u5173\u4E8E\u6C22\u80FD\u4E13\u4E1A\u7684\u4EFB\u4F55\u95EE\u9898\uFF0C\u4F8B\u5982\uFF1A<br>\u4E13\u4E1A\u4ECB\u7ECD \u00B7 \u6838\u5FC3\u8BFE\u7A0B \u00B7 \u5E08\u8D44\u529B\u91CF \u00B7 \u62DB\u751F\u5C31\u4E1A \u00B7 \u7814\u7A76\u65B9\u5411</div></div></div><div id="ai-qa-input-area"><input type="text" id="ai-qa-input" placeholder="\u8F93\u5165\u4F60\u7684\u95EE\u9898\u2026" autocomplete="off"><button id="ai-qa-send">\u53D1\u9001</button></div>';
  document.body.appendChild(panel);

  var msgEl = document.getElementById('ai-qa-messages');
  var inpEl = document.getElementById('ai-qa-input');
  var sndBtn = document.getElementById('ai-qa-send');
  var opened = false;

  function addMsg(type, text) {
    var d = document.createElement('div');
    d.className = 'msg ' + type;
    var b = document.createElement('div');
    b.className = 'bubble';
    b.innerHTML = text;
    d.appendChild(b);
    msgEl.appendChild(d);
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  function showTyping() {
    var e = document.getElementById('qa-typing');
    if (e) e.remove();
    var d = document.createElement('div');
    d.className = 'msg bot typing';
    d.id = 'qa-typing';
    var b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = '\u{1F914} \u601D\u8003\u4E2D\u2026';
    d.appendChild(b);
    msgEl.appendChild(d);
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  function hideTyping() {
    var e = document.getElementById('qa-typing');
    if (e) e.remove();
  }

  var sug = ['\u8FD9\u4E2A\u4E13\u4E1A\u662F\u4EC0\u4E48','\u6709\u54EA\u4E9B\u6838\u5FC3\u8BFE\u7A0B','\u6709\u591A\u5C11\u8001\u5E08','\u672C\u79D1\u5C31\u4E1A\u600E\u4E48\u6837','\u7814\u7A76\u65B9\u5411\u6709\u54EA\u4E9B','\u9700\u8981\u4FEE\u591A\u5C11\u5B66\u5206'];

  function sugHtml() {
    var h = '<div style="margin-top:12px;padding-top:10px;border-top:1px dashed #dce4ed;"><div style="font-size:13px;color:#5a6f84;margin-bottom:6px;">\u8BD5\u8BD5\u8FD9\u4E9B\u95EE\u9898\uFF1A</div><div style="display:flex;flex-wrap:wrap;gap:6px;">';
    for (var j = 0; j < sug.length; j++) {
      h += '<button class="qa-suggest-btn" style="padding:4px 12px;font-size:13px;border:1px solid #1a5a8c;border-radius:14px;background:#f5f9ff;color:#1a5a8c;cursor:pointer;font-family:inherit;">' + sug[j] + '</button>';
    }
    return h + '</div></div>';
  }

  // ===== 通过 CloudBase SDK 调用云函数 =====
  async function callAPI(question) {
    var app = cloudbase.init({
      env: 'hydrogen-web-d4gbhq49p6879f58e'
    });
    var res = await app.callFunction({
      name: 'chat',
      data: { message: question }
    });
    return {
      ok: true,
      json: async function() {
        return typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
      }
    };
  }

  async function handleQ(question) {
    if (!question.trim()) return;
    addMsg('user', question);
    inpEl.value = '';
    showTyping();
    try {
      var resp = await callAPI(question);
      hideTyping();
      var data = await resp.json();
      // 检查云函数是否返回了错误
      if (data.error) {
        throw new Error(data.error);
      }
      var ans = null;
      try { ans = data.choices[0].message.content; } catch(e) {}
      if (ans && ans.trim()) {
        addMsg('bot', ans.replace(/\n/g, '<br>') + sugHtml());
      } else {
        addMsg('bot', '\u62B1\u6B49\uFF0C\u65E0\u6CD5\u89E3\u6790\u56DE\u7B54\u3002' + sugHtml());
      }
    } catch (err) {
      hideTyping();
      addMsg('bot', '\u{1F534} \u8FDE\u63A5 AI \u670D\u52A1\u5931\u8D25\uFF1A' + err.message + sugHtml());
    }
  }

  btn.onclick = function() {
    opened = !opened;
    panel.classList.toggle('open', opened);
    btn.innerHTML = opened ? '\u2715' : '\u{1F4AC}';
    if (opened) inpEl.focus();
  };
  panel.querySelector('.close-btn').onclick = function() {
    opened = false;
    panel.classList.remove('open');
    btn.innerHTML = '\u{1F4AC}';
  };
  sndBtn.onclick = function() { handleQ(inpEl.value); };
  inpEl.onkeydown = function(e) { if (e.key === 'Enter') handleQ(inpEl.value); };
  msgEl.onclick = function(e) {
    var t = e.target.closest('.qa-suggest-btn');
    if (t) handleQ(t.textContent);
  };
  console.log('[AI Q&A] \u5DF2\u52A0\u8F7D\uFF08CloudBase SDK \u6A21\u5F0F\uFF09');
})();
