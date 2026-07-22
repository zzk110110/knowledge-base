// search.js
// 依赖 Fuse.js（通过 CDN 引入）

(function() {
  // ----- 注入搜索框样式 -----
  var style = document.createElement('style');
  style.textContent = `
    /* 搜索框容器 */
    #search-container {
      max-width: 600px;
      margin: 20px auto 30px auto;
      position: relative;
    }
    #search-container input {
      width: 100%;
      padding: 12px 20px;
      font-size: 16px;
      border: 2px solid #bccbd9;
      border-radius: 30px;
      outline: none;
      background: #ffffff;
      transition: border-color 0.3s, box-shadow 0.3s;
      box-sizing: border-box;
    }
    #search-container input:focus {
      border-color: #1a5a8c;
      box-shadow: 0 0 0 3px rgba(26, 90, 140, 0.15);
    }
    #search-container input::placeholder {
      color: #8a9aa8;
      font-style: italic;
    }
    /* 结果下拉列表 */
    #search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #ffffff;
      border: 1px solid #d0dce8;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      max-height: 300px;
      overflow-y: auto;
      z-index: 999;
      display: none;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    #search-results li {
      padding: 12px 20px;
      border-bottom: 1px solid #eaf0f8;
      cursor: pointer;
    }
    #search-results li:last-child {
      border-bottom: none;
    }
    #search-results li:hover {
      background: #f5f9ff;
    }
    #search-results li a {
      display: block;
      text-decoration: none;
      color: #1e2a3a;
    }
    #search-results li .result-title {
      font-weight: 600;
      font-size: 16px;
    }
    #search-results li .result-desc {
      font-size: 14px;
      color: #5a6f84;
      margin-top: 4px;
    }
    #search-results li .result-score {
      float: right;
      font-size: 12px;
      color: #8a9aa8;
    }
    /* 无结果提示 */
    #search-results .no-result {
      padding: 16px 20px;
      color: #5a6f84;
      text-align: center;
      font-style: italic;
    }
  `;
  document.head.appendChild(style);

  // ----- 构建搜索框HTML -----
  var container = document.getElementById('search-container');
  if (!container) return; // 如果页面没有该容器，则不加载

  container.innerHTML = `
    <input type="text" id="search-input" placeholder="🔍 搜索全站内容（专业、课程、师资……）" autocomplete="off">
    <ul id="search-results"></ul>
  `;

  var input = document.getElementById('search-input');
  var resultsUl = document.getElementById('search-results');

  // ----- 初始化 Fuse -----
  var fuse = new Fuse(searchData, {
    keys: ['title', 'description'],
    threshold: 0.4,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 1
  });

  // ----- 防抖函数 -----
  function debounce(fn, delay) {
    var timer = null;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  }

  // ----- 渲染搜索结果 -----
  function renderResults(query) {
    if (!query || query.trim().length === 0) {
      resultsUl.style.display = 'none';
      return;
    }

    var results = fuse.search(query.trim());
    if (results.length === 0) {
      resultsUl.innerHTML = '<li class="no-result">😕 未找到相关内容，试试其他关键词</li>';
      resultsUl.style.display = 'block';
      return;
    }

    // 限制显示前10条
    var maxShow = 10;
    var html = '';
    for (var i = 0; i < Math.min(results.length, maxShow); i++) {
      var item = results[i].item;
      var score = results[i].score;
      html += `
        <li>
          <a href="${item.url}">
            <span class="result-title">${item.title}</span>
            <span class="result-score">匹配度 ${(1 - score).toFixed(2)}</span>
            <div class="result-desc">${item.description}</div>
          </a>
        </li>
      `;
    }
    if (results.length > maxShow) {
      html += `<li class="no-result">…… 还有 ${results.length - maxShow} 条结果</li>`;
    }
    resultsUl.innerHTML = html;
    resultsUl.style.display = 'block';
  }

  // ----- 绑定输入事件（防抖） -----
  var debouncedSearch = debounce(function(e) {
    renderResults(e.target.value);
  }, 250);

  input.addEventListener('input', debouncedSearch);

  // ----- 点击外部关闭下拉 -----
  document.addEventListener('click', function(e) {
    var target = e.target;
    if (!container.contains(target)) {
      resultsUl.style.display = 'none';
    }
  });

  // 如果输入框失焦，延迟关闭（避免点击链接前被关闭）
  input.addEventListener('blur', function() {
    setTimeout(function() {
      resultsUl.style.display = 'none';
    }, 200);
  });

  // 回车键跳转第一个结果
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var firstLink = resultsUl.querySelector('li a');
      if (firstLink) {
        window.location.href = firstLink.getAttribute('href');
      }
    }
  });

})();