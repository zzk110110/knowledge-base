// ============================================================
// ai-qa.js — AI 智能问答
// 基于网站内容构建的知识库，使用 Fuse.js 进行模糊匹配
// ============================================================

(function() {
  // ===================== 知识库 =====================
  var qaData = [
    // ---- 专业概况 ----
    {
      q: "这个专业是什么",
      a: "氢能科学与工程是华北电力大学能源动力与机械工程学院开设的本科专业，聚焦氢能全产业链——制氢、储氢、输氢、用氢，服务国家「双碳」战略目标。"
    },
    {
      q: "氢能专业介绍",
      a: "氢能科学与工程专业属于「能源动力类」，基本学制4年，授予工学学士学位。该专业于2022年获批并开始招生，首批本科生于2022年秋季入学，是响应国家氢能发展战略而设立的新兴交叉学科专业。"
    },
    {
      q: "专业代码是什么",
      a: "氢能科学与工程专业的专业代码是080506TK，属于「能源动力类」。"
    },
    {
      q: "氢能专业属于哪个学院",
      a: "氢能科学与工程专业隶属于华北电力大学能源动力与机械工程学院。"
    },
    {
      q: "氢能专业的培养目标是什么",
      a: "培养目标：具备氢能科学与工程领域扎实的基础理论和系统的专业知识，能够在氢能产业链（制氢、储氢、输氢、用氢）及相关领域从事科学研究、技术开发、工程设计、运行维护和管理等工作的高素质复合型人才。毕业生能够在氢能及能源动力领域成为技术骨干或管理人才。"
    },
    {
      q: "毕业要求是什么",
      a: "毕业要求包括12条核心能力：工程知识、问题分析、设计/开发解决方案、研究、使用现代工具、工程与社会、环境和可持续发展、职业规范、个人和团队、沟通、项目管理、终身学习。需修满培养方案规定的全部课程学分，并满足创新创业教育学分要求。"
    },

    // ---- 学制学位 ----
    {
      q: "学制是几年",
      a: "氢能科学与工程专业基本学制为4年，实行弹性学习年限，学生可在3-6年内完成学业。"
    },
    {
      q: "授予什么学位",
      a: "氢能科学与工程专业授予工学学士学位。"
    },
    {
      q: "需要修多少学分",
      a: "毕业总学分要求为175学分，包括通识教育课程（必修+选修）、学科基础课程、专业核心课程、专业选修课程、集中实践教学环节。"
    },

    // ---- 课程体系 ----
    {
      q: "有哪些核心课程",
      a: "核心课程包括：氢能科学与工程导论、工程化学、电化学工程、制氢原理、氢储存与输运、燃料电池、氢燃烧与动力、氢能系统及应用、氢安全、加氢站、材料科学与工程技术、工程热力学、工程流体力学、传热与传质等。"
    },
    {
      q: "课程体系是怎样的",
      a: "课程体系分为通识教育（思想政治、外语、数学、体育等）、学科基础（数学、物理、化学、工程制图等）、专业核心（制氢原理、燃料电池、氢储存与输运、氢安全等）、专业选修（氢能经济、氢能法规、新能源发电、多物理场仿真等）、集中实践（实验、实习、毕业设计等）五大模块。共175学分。"
    },
    {
      q: "知识链怎么构成的",
      a: "形成了四条核心知识链：1️⃣ 化学知识链——工程化学→电化学工程→制氢原理/燃料电池；2️⃣ 工程热物理知识链——工程热力学/流体力学/传热与传质→氢燃烧与动力；3️⃣ 材料科学知识链——材料科学与工程技术→材料固体理论基础→储氢材料/电极材料；4️⃣ 电气与控制知识链——电工技术→电子技术→自动控制原理→氢能系统集成。"
    },

    // ---- 师资力量 ----
    {
      q: "有多少老师",
      a: "专业现有专任教师32人，其中教授10人、副教授11人、讲师11人。同时聘请来自国电投、中石化等央企氢能公司的兼职教师12人，形成了校企协同的师资队伍。"
    },
    {
      q: "师资团队如何",
      a: "师资队伍结构合理，拥有教授10人、副教授11人、讲师11人，涉及电解制氢、热化学制氢、固态储氢、燃料电池、氢燃烧及氢内燃机、仿真模拟、氢安全等七大研究方向。此外聘请了12位来自国电投、中石化等企业的兼职教师，强化工程实践教学。"
    },
    {
      q: "研究方向有哪些",
      a: "七大研究方向：1️⃣ 电解制氢技术；2️⃣ 热化学制氢技术；3️⃣ 固态储氢技术；4️⃣ 燃料电池技术；5️⃣ 氢燃烧及氢内燃机技术；6️⃣ 仿真模拟技术；7️⃣ 氢安全技术。"
    },
    {
      q: "氢能教研室主任是谁",
      a: "氢能科学与工程教研室主任是刘建国教授。华北电力大学（保定）氢能教研室主任是杨维结。"
    },
    {
      q: "有哪些知名教授",
      a: "专任教师32人，形成了一支以教授为学科带头人、副教授为骨干、讲师为后备的完整梯队。教研室主任刘建国教授领衔。"
    },

    // ---- 招生 ----
    {
      q: "本科招生多少人",
      a: "2022年招生30人（北京校部20人+保定校区10人）；2023年招生60人（北京+保定各30人）；2024年招生80人（北京50人+保定30人）；2025年招生增至120人（北京+保定合计120人/年）。规模稳步扩大。"
    },
    {
      q: "研究生招生情况",
      a: "2022年学术型硕士10人/年（北京+保定）；2023-2024年专业型硕士50人；2025年学术型硕士17人+专业型硕士70人（含卓越工程师20人）。博士研究生学术型5-7人/年，专业型5-10人/年。"
    },
    {
      q: "博士招生",
      a: "博士研究生招生：学术型5-7人/年，专业型5-10人/年。"
    },
    {
      q: "氢能专业哪年开始招生",
      a: "氢能科学与工程专业于2022年获批并开始招生，首批本科生于2022年秋季入学。"
    },

    // ---- 就业 ----
    {
      q: "本科就业怎么样",
      a: "2022级本科毕业生共31人。保研8人（学术保研4人+校企联培保研/直博4人），考研上岸15人（本校为主），拟就业8人（部分已签约华电科工氢能事业部、南瑞氢电公司、中广核等电力企业）。深造率约74%。"
    },
    {
      q: "研究生就业去向",
      a: "研究生就业呈双轨并行格局：约50%进入氢能技术研发领域（华电电科院、南瑞氢电、东方氢能、无锡威孚、亿华通等）；约50%进入传统电力企业（南方电网广东能发、中能建山西电勘院、三峡湖北鄂州电厂、中广核电厂等）。体现了「电氢协同」特色。"
    },
    {
      q: "就业前景如何",
      a: "就业前景广阔。本科深造率约74%，就业同学签约氢能及电力头部企业。研究生就业呈「氢能技术研发」与「传统电力系统」双轨并行，既服务氢能新兴产业，也支撑电力行业绿色转型。专业紧密对接国家「双碳」战略和氢能产业发展需求。"
    },
    {
      q: "毕业生能去哪些单位",
      a: "氢能方向：华电电科院、南瑞氢电、东方氢能、亿华通、北京氢璞创能、国家能源集团北京低碳院等。电力方向：南方电网、中能建、三峡集团、中广核、华电科工等。"
    },
    {
      q: "可以考研吗",
      a: "可以。专业设有硕士点和博士点，硕士分为学术型（氢能方向）和专业型（含卓越工程师计划）。本科毕业生可报考本校或外校的研究生。"
    },

    // ---- 氢能技术 ----
    {
      q: "什么是电解制氢",
      a: "电解制氢是利用电能将水分解为氢气和氧气的技术，是专业七大研究方向之一。课程「制氢原理」重点讲授电解制氢的电化学反应机理、催化反应原理以及制氢器件的结构与设计。"
    },
    {
      q: "什么是燃料电池",
      a: "燃料电池是将氢气的化学能直接转化为电能的装置。专业设有「燃料电池」课程，系统介绍燃料电池的工作原理、分类、电化学反应过程、离子传导机制、催化剂作用机理以及电堆关键部件及设计。"
    },
    {
      q: "氢安全是什么",
      a: "氢安全贯穿从制氢到用氢的全过程，是专业核心课程之一。涵盖氢气泄漏检测与防控、安全操作规程、风险评估等内容，与所有核心专业课程形成交叉支撑关系。"
    },
    {
      q: "氢储存与输运",
      a: "「氢储存与输运」是专业核心课程，讲授氢气的储存方式和输运技术，包括固态储氢、高压气态储氢、液态储氢等储氢方式，以及氢气管道输运、罐车输运等技术。其中固态储氢是专业七大研究方向之一。"
    },

    // ---- 本科 vs 研究生 ----
    {
      q: "本科教育和研究生教育有什么区别",
      a: "本科教育侧重通识基础+专业核心知识，培养能在氢能产业链从事技术开发、工程设计等工作的人才。研究生教育（硕士/博士）侧重深度科研能力和创新能力培养，学术型侧重理论研究，专业型（含卓越工程师）侧重工程实践。"
    },
    {
      q: "本科有哪些子页面",
      a: "本科教育包含四个子页面：「专业介绍」、「专业课程」、「教师团队」、「人才培养（本科）」。"
    },
    {
      q: "研究生有哪些子页面",
      a: "研究生教育包含三个子页面：「专业介绍」、「专业课程」、「人才培养（研究生）」。"
    },

    // ---- 其他 ----
    {
      q: "网站有哪些功能",
      a: "本网站提供：1️⃣ 全站搜索功能——输入关键词可搜索全站内容；2️⃣ AI智能问答——点击右下角气泡即可向我提问；3️⃣ 导航功能——通过首页导航卡片进入本科/研究生教育各子页面。"
    },
    {
      q: "学校官网链接是什么",
      a: "相关链接：能源动力与机械工程学院页面 https://goto.ncepu.edu.cn/yxzy/nydlyjxgcxy/index.htm ；本科招生页面 https://thermal.ncepu.edu.cn/zspy/bkszspy/index.htm"
    }
  ];

  // ===================== 样式注入 =====================
  var style = document.createElement('style');
  style.textContent = `
    /* ---- AI 问答气泡按钮 ---- */
    #ai-qa-toggle {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a5a8c, #0a2a4a);
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(26, 58, 92, 0.35);
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #ai-qa-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(26, 58, 92, 0.45);
    }
    #ai-qa-toggle:active {
      transform: scale(0.95);
    }

    /* ---- 聊天面板 ---- */
    #ai-qa-panel {
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 380px;
      max-width: calc(100vw - 60px);
      max-height: 70vh;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
      z-index: 10001;
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #dce4ed;
      font-family: 'Times New Roman', '宋体', 'SimSun', serif;
    }
    #ai-qa-panel.open {
      display: flex;
    }

    /* ---- 面板头部 ---- */
    #ai-qa-header {
      background: linear-gradient(135deg, #1a5a8c, #0a2a4a);
      color: #fff;
      padding: 16px 20px;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 1px;
    }
    #ai-qa-header .close-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
      opacity: 0.8;
    }
    #ai-qa-header .close-btn:hover {
      opacity: 1;
    }
    #ai-qa-header .subtitle {
      font-size: 12px;
      font-weight: 400;
      opacity: 0.8;
      margin-top: 2px;
    }

    /* ---- 消息区域 ---- */
    #ai-qa-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 18px;
      background: #f7f9fc;
      min-height: 200px;
      max-height: 400px;
    }
    #ai-qa-messages .msg {
      margin-bottom: 14px;
      max-width: 90%;
      clear: both;
    }
    #ai-qa-messages .msg.user {
      float: right;
    }
    #ai-qa-messages .msg.bot {
      float: left;
    }
    #ai-qa-messages .msg .bubble {
      padding: 10px 16px;
      border-radius: 14px;
      font-size: 15px;
      line-height: 1.6;
      word-wrap: break-word;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    #ai-qa-messages .msg.user .bubble {
      background: #1a5a8c;
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    #ai-qa-messages .msg.bot .bubble {
      background: #ffffff;
      color: #1e2a3a;
      border: 1px solid #dce4ed;
      border-bottom-left-radius: 4px;
    }
    #ai-qa-messages .msg.bot .bubble a {
      color: #1a5a8c;
      text-decoration: underline;
    }
    #ai-qa-messages .msg.bot .bubble .suggestions {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    #ai-qa-messages .msg.bot .bubble .suggestions button {
      padding: 4px 12px;
      font-size: 13px;
      border: 1px solid #1a5a8c;
      border-radius: 14px;
      background: #f5f9ff;
      color: #1a5a8c;
      cursor: pointer;
      transition: background 0.15s;
      font-family: inherit;
    }
    #ai-qa-messages .msg.bot .bubble .suggestions button:hover {
      background: #1a5a8c;
      color: #fff;
    }
    #ai-qa-messages .typing .bubble {
      background: #ffffff;
      border: 1px solid #dce4ed;
      border-bottom-left-radius: 4px;
      color: #8a9aa8;
      font-style: italic;
    }

    /* ---- 输入区 ---- */
    #ai-qa-input-area {
      display: flex;
      padding: 12px 16px;
      border-top: 1px solid #e2e9f2;
      background: #fff;
      gap: 8px;
    }
    #ai-qa-input-area input {
      flex: 1;
      padding: 10px 14px;
      border: 2px solid #dce4ed;
      border-radius: 24px;
      font-size: 15px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    #ai-qa-input-area input:focus {
      border-color: #1a5a8c;
    }
    #ai-qa-input-area button {
      padding: 10px 20px;
      border: none;
      border-radius: 24px;
      background: linear-gradient(135deg, #1a5a8c, #0a2a4a);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
      font-family: inherit;
    }
    #ai-qa-input-area button:hover {
      opacity: 0.9;
    }
    #ai-qa-input-area button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ---- 移动端响应 ---- */
    @media (max-width: 480px) {
      #ai-qa-panel {
        right: 10px;
        bottom: 90px;
        width: calc(100vw - 20px);
        max-height: 75vh;
      }
      #ai-qa-toggle {
        right: 16px;
        bottom: 16px;
        width: 54px;
        height: 54px;
        font-size: 22px;
      }
    }
  `;
  document.head.appendChild(style);

  // ===================== 构建 DOM =====================
  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'ai-qa-toggle';
  toggleBtn.innerHTML = '💬';
  toggleBtn.setAttribute('aria-label', '打开 AI 问答');
  document.body.appendChild(toggleBtn);

  var panel = document.createElement('div');
  panel.id = 'ai-qa-panel';
  panel.innerHTML = `
    <div id="ai-qa-header">
      <div>
        <div>🤖 AI 智能问答</div>
        <div class="subtitle">华北电力大学 · 氢能科学与工程</div>
      </div>
      <button class="close-btn" aria-label="关闭">✕</button>
    </div>
    <div id="ai-qa-messages">
      <div class="msg bot">
        <div class="bubble">
          你好！我是氢能专业小助手 🧑‍🔬<br>
          你可以问我关于氢能专业的任何问题，例如：<br>
          专业介绍 · 核心课程 · 师资力量 · 招生就业 · 研究方向
        </div>
      </div>
    </div>
    <div id="ai-qa-input-area">
      <input type="text" id="ai-qa-input" placeholder="输入你的问题…" autocomplete="off">
      <button id="ai-qa-send">发送</button>
    </div>
  `;
  document.body.appendChild(panel);

  // ===================== 引用元素 =====================
  var messagesEl = document.getElementById('ai-qa-messages');
  var inputEl = document.getElementById('ai-qa-input');
  var sendBtn = document.getElementById('ai-qa-send');
  var closeBtn = panel.querySelector('.close-btn');
  var isOpen = false;

  // ===================== Fuse 索引 =====================
  var fuse = new Fuse(qaData, {
    keys: ['q'],
    threshold: 0.45,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 2
  });

  // ===================== 回答匹配 =====================
  function getAnswer(question) {
    var q = question.trim();
    if (!q) return null;

    var results = fuse.search(q);
    if (results.length === 0 || results[0].score > 0.55) return null;

    var best = results[0];
    var score = best.score;
    var item = best.item;

    // 如果匹配度很高，直接返回答案
    if (score < 0.3) {
      return { answer: item.a, matchScore: score };
    }

    // 中等匹配度，给答案 + 建议引导
    return { answer: item.a, matchScore: score };
  }

  // ===================== 建议问题 =====================
  var suggestions = [
    '这个专业是什么',
    '有哪些核心课程',
    '有多少老师',
    '本科就业怎么样',
    '研究方向有哪些',
    '需要修多少学分'
  ];

  function getSuggestionsHtml() {
    var html = '<div class="suggestions">';
    suggestions.forEach(function(s) {
      html += '<button class="qa-suggest-btn">' + s + '</button>';
    });
    html += '</div>';
    return html;
  }

  // ===================== 添加消息 =====================
  function addMessage(type, content, isHtml) {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + type;

    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (isHtml) {
      bubble.innerHTML = content;
    } else {
      bubble.textContent = content;
    }

    msgDiv.appendChild(bubble);
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addTypingIndicator() {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'msg bot typing';
    msgDiv.id = 'qa-typing';
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = '思考中…';
    msgDiv.appendChild(bubble);
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTypingIndicator() {
    var el = document.getElementById('qa-typing');
    if (el) el.remove();
  }

  // ===================== 处理问题 =====================
  function handleQuestion(question) {
    if (!question || question.trim().length === 0) return;

    // 添加用户消息
    addMessage('user', question);

    // 清空输入
    inputEl.value = '';

    // 显示打字指示
    addTypingIndicator();

    // 模拟思考延迟（提升体验）
    setTimeout(function() {
      removeTypingIndicator();

      var result = getAnswer(question);

      if (result) {
        var htmlContent = result.answer;
        // 追加建议问题
        htmlContent += '<div style="margin-top:12px;padding-top:10px;border-top:1px dashed #dce4ed;font-size:13px;color:#5a6f84;">试试这些问题：</div>';
        htmlContent += getSuggestionsHtml();
        addMessage('bot', htmlContent, true);
      } else {
        // 没有匹配到，引导使用搜索功能
        var fallback = '😅 抱歉，我暂时无法回答这个问题。建议使用页面顶部的 <strong>搜索功能</strong> 查找相关内容，或者试试以下问题：';
        fallback += '<div style="margin-top:10px;">' + getSuggestionsHtml() + '</div>';
        addMessage('bot', fallback, true);
      }
    }, 400);
  }

  // ===================== 事件绑定 =====================
  // 切换面板
  toggleBtn.addEventListener('click', function() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    toggleBtn.innerHTML = isOpen ? '✕' : '💬';
    if (isOpen) {
      inputEl.focus();
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  });

  closeBtn.addEventListener('click', function() {
    isOpen = false;
    panel.classList.remove('open');
    toggleBtn.innerHTML = '💬';
  });

  // 发送消息
  function send() {
    var text = inputEl.value.trim();
    if (text) {
      handleQuestion(text);
    }
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') send();
  });

  // 建议问题按钮点击（事件委托）
  messagesEl.addEventListener('click', function(e) {
    var btn = e.target.closest('.qa-suggest-btn');
    if (btn) {
      handleQuestion(btn.textContent);
    }
  });

  console.log('🤖 AI 智能问答已加载，共 ' + qaData.length + ' 条知识条目');
})();
