'use strict';

// 화면 전환 시 문서를 다시 열어 두 앱의 스타일과 이벤트를 분리합니다.
(() => {
  const admin = new URLSearchParams(location.search).get('view') === 'admin';
  const layout = document.getElementById(admin ? 'admin-layout' : 'user-layout');
  document.title = admin ? '시스템 관리 | 중해심 AI' : 'AAAS · AI 기반 해양사고 분석 시스템';
  document.querySelector('meta[name="theme-color"]').content = admin ? '#151e36' : '#0d1628';
  document.body.className = admin ? '' : 'home-view';
  document.body.replaceChildren(layout.content.cloneNode(true));

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = admin ? 'styles.css' : 'user.css';
  document.head.append(stylesheet);

  const script = document.createElement('script');
  script.src = admin ? 'app.js' : 'user.js';
  script.onerror = () => {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = '화면을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.';
    document.body.prepend(message);
  };
  document.body.append(script);
})();
