// common.js — 森林数据页面公共工具函数
(function(global) {
  'use strict';

  // === HTML 转义 ===
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  var escHtml = esc;

  function escAttr(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // === userId 脱敏 ===
  function maskUserId(v) {
    v = String(v || '');
    if (v.length >= 8) return v.substring(0, 3) + '****' + v.substring(v.length - 4);
    return v;
  }

  // === 头像 HTML 生成 ===
  function avatarHtml(user, size) {
    var s = size || 40;
    var src = (user && user.头像) || '';
    var fs = Math.round(s * 0.45);
    if (src) {
      return '<img src="' + esc(src) + '" referrerpolicy="no-referrer" ' +
        'style="width:' + s + 'px;height:' + s + 'px;border-radius:50%;object-fit:cover;flex-shrink:0" ' +
        'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline-flex\'">' +
        '<span style="display:none;width:' + s + 'px;height:' + s + 'px;border-radius:50%;' +
        'background:linear-gradient(135deg,#d4f0d4,#a8d5a8);align-items:center;justify-content:center;' +
        'font-size:' + fs + 'px;color:#3a7a3a;flex-shrink:0">' +
        '<i class="fa-solid fa-user"></i></span>';
    }
    return '<span style="display:inline-flex;width:' + s + 'px;height:' + s + 'px;border-radius:50%;' +
      'background:linear-gradient(135deg,#d4f0d4,#a8d5a8);align-items:center;justify-content:center;' +
      'font-size:' + fs + 'px;color:#3a7a3a;flex-shrink:0">' +
      '<i class="fa-solid fa-user"></i></span>';
  }

  // === localStorage 数据缓存 ===
  var CACHE_KEY = 'forest_json';
  function getCached() {
    try { var r = localStorage.getItem(CACHE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; }
  }
  function setCached(d) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) {}
  }

  // === 导出 ===
  global.ForestUtils = {
    esc: esc, escHtml: escHtml, escAttr: escAttr,
    maskUserId: maskUserId,
    avatarHtml: avatarHtml,
    getCached: getCached, setCached: setCached
  };
})(window);
