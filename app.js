'use strict';

// 외부 라이브러리·빌드 과정 없이 file://에서도 실행하는 화면 설계용 프로토타입입니다.
const paths = {
  grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  database:'M20 5c0 2-16 2-16 0s16-2 16 0v14c0 3-16 3-16 0V5 M4 12c0 3 16 3 16 0',
  brain:'M9 4a3 3 0 0 0-5 3 4 4 0 0 0-1 7 4 4 0 0 0 6 5V4 M15 4a3 3 0 0 1 5 3 4 4 0 0 1 1 7 4 4 0 0 1-6 5V4 M6 8l3 2 M15 13l3 2 M9 16l-3-2 M15 7l3 2',
  settings:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6',
  layers:'m12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',
  bell:'M18 8a6 6 0 0 0-12 0c0 8-3 7-3 10h18c0-3-3-2-3-10 M10 21h4',
  home:'m3 10 9-7 9 7 M5 9v12h14V9 M10 21v-7h4v7',
  chevron:'m9 5 7 7-7 7',
  arrow:'M4 12h16 m-6-6 6 6-6 6',
  refresh:'M20 7a8 8 0 0 0-14-2L3 8 M3 3v5h5 M4 17a8 8 0 0 0 14 2l3-3 M21 21v-5h-5',
  plus:'M12 5v14 M5 12h14',
  calendar:'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16',
  file:'M5 3h9l5 5v13H5z M14 3v6h5 M8 13h8 M8 17h6',
  check:'m5 12 4 4L19 6',
  clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v5l3 2',
  upload:'M12 16V3 m-5 5 5-5 5 5 M4 14v7h16v-7',
  download:'M12 3v13 m-5-5 5 5 5-5 M4 16v5h16v-5',
  search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 m5 12 6 6',
  info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 11v6 M12 7v1',
  shield:'m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z m-4 10 3 3 5-6',
  server:'M3 3h18v7H3z M3 14h18v7H3z M6 6h1 M6 17h1 M11 6h7 M11 17h7',
  close:'m6 6 12 12 M6 18 18 6',
  menu:'M3 6h18 M3 12h18 M3 18h18',
  play:'m8 4 12 8-12 8z',
  code:'m8 6-6 6 6 6 M16 6l6 6-6 6 M14 3l-4 18',
  link:'m9 8 3-3a5 5 0 0 1 7 7l-3 3 M15 16l-3 3a5 5 0 0 1-7-7l3-3 M8 16l8-8',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.file}"/></svg>`;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups = [
  {name:'학습 데이터 관리',icon:'database',items:[['collection','데이터 수집/선별'],['schedule','수집 스케줄 관리'],['source','원본/가공 데이터 관리'],['preprocess','전처리 작업 관리'],['metadata','메타정보 관리'],['tracking','출처 추적'],['labeling','오토 라벨링']]},
  {name:'파인튜닝 관리',icon:'brain',items:[['prompt','프롬프트 관리'],['dataset','파인튜닝 데이터 관리'],['training','학습 관리'],['history','학습 이력 관리'],['trained-model','학습 모델 형상 관리'],['backup','학습 모델 백업 관리']]},
  {name:'AI 설정 관리',icon:'settings',items:[['limits','첨부파일·입출력 제한'],['infrastructure','AI 인프라·패키징 설정']]},
  {name:'모델 형상 관리',icon:'layers',items:[['versions','시스템·모델 버전 목록'],['version-register','시스템·모델 버전 등록']]},
  {name:'시스템 알림 관리',icon:'bell',items:[['notifications','알림 목록'],['notification-register','알림 등록']]},
];
const initialState = {
  activeModel:'haesim-llm-v2.3',
  documents:[
    {id:'DOC-2026-01842',name:'어선 제7해성호·화물선 충돌사건',type:'재결서',court:'부산해심',date:'2026.09.16 09:42',status:'완료',size:'2.4 MB',caseNo:'부산해심 제2026-041호',label:'충돌',pages:18},
    {id:'DOC-2026-01841',name:'일반화물선 동진호 좌초사건',type:'재결서',court:'인천해심',date:'2026.09.16 09:38',status:'전처리 중',size:'1.8 MB',caseNo:'인천해심 제2026-028호',label:'좌초',pages:12},
    {id:'DOC-2026-01840',name:'여객선 바다누리호 기관손상사건',type:'조사보고서',court:'목포해심',date:'2026.09.16 09:31',status:'완료',size:'3.1 MB',caseNo:'목포해심 제2026-037호',label:'기관손상',pages:24},
    {id:'DOC-2026-01839',name:'해양사고 관련 법령 및 시행규칙',type:'법령',court:'중앙해심',date:'2026.09.16 09:25',status:'검토 필요',size:'4.7 MB',caseNo:'법령-2026-009',label:'관련 법령',pages:46},
    {id:'DOC-2026-01838',name:'예인선 한빛호·부선 해광호 접촉사건',type:'재결서',court:'동해해심',date:'2026.09.16 09:12',status:'완료',size:'1.6 MB',caseNo:'동해해심 제2026-022호',label:'접촉',pages:15},
    {id:'DOC-2026-01837',name:'어선 청해호 화재사건',type:'조사보고서',court:'부산해심',date:'2026.09.15 17:42',status:'완료',size:'2.9 MB',caseNo:'부산해심 제2026-040호',label:'화재',pages:21},
    {id:'DOC-2026-01836',name:'화물선 동해스타호 침몰사건',type:'재결서',court:'동해해심',date:'2026.09.15 16:10',status:'대기',size:'2.2 MB',caseNo:'동해해심 제2026-021호',label:'침몰',pages:17},
    {id:'DOC-2026-01835',name:'낚시어선 은빛호 안전사고',type:'재결서',court:'목포해심',date:'2026.09.15 15:22',status:'완료',size:'1.3 MB',caseNo:'목포해심 제2026-036호',label:'안전사고',pages:9},
    {id:'DOC-2026-01834',name:'유조선 태평양호 해양오염사건',type:'조사보고서',court:'인천해심',date:'2026.09.15 14:10',status:'검토 필요',size:'3.8 MB',caseNo:'인천해심 제2026-027호',label:'해양오염',pages:32},
  ],
  alerts:[
    {id:'NT-003',title:'학습 데이터 수집이 완료되었습니다.',kind:'데이터',level:'안내',date:'2026.09.16 09:42',body:'정기 수집 작업으로 재결서 128건이 추가되었습니다. 전처리 상태와 메타정보를 확인해 주세요.',read:false},
    {id:'NT-002',title:'GPU 메모리 사용률을 확인해 주세요.',kind:'인프라',level:'주의',date:'2026.09.16 09:30',body:'예시 학습 서버 GPU 01의 메모리 사용률이 85%에 도달했습니다. 학습 작업의 배치 크기를 확인해 주세요.',read:false},
    {id:'NT-001',title:'haesim-llm-v2.3 모델이 활성화되었습니다.',kind:'모델',level:'안내',date:'2026.09.16 08:50',body:'관리자가 haesim-llm-v2.3 모델을 활성화했습니다. 변경 이력은 시스템·모델 버전 목록에서 확인할 수 있습니다.',read:true},
  ],
  schedules:[{id:'SCH-001',name:'해양사고 재결서 정기 수집',source:'중앙해양안전심판원',cycle:'매일 09:00',last:'2026.09.16 09:00',status:'활성'}, {id:'SCH-002',name:'관련 법령 변경 수집',source:'국가법령정보센터',cycle:'매주 월요일 06:00',last:'2026.09.14 06:00',status:'활성'},{id:'SCH-003',name:'조사보고서 일괄 수집',source:'내부 자료 저장소',cycle:'매일 18:00',last:'2026.09.15 18:00',status:'중지'}],
  training:[{id:'FT-20260916-01',name:'해양사고 재결서 전문 학습',model:'haesim-llm-v2.3',dataset:'재결서 학습 세트 v3',progress:68,status:'학습 중',date:'2026.09.16 08:30',epochs:'2 / 3',loss:'0.182'},{id:'FT-20260915-02',name:'해양 법령 질의응답 보강',model:'haesim-llm-v2.2',dataset:'법령 QA 세트 v2',progress:100,status:'완료',date:'2026.09.15 14:00',epochs:'3 / 3',loss:'0.164'}],
  versions:[{id:'haesim-llm-v2.3',date:'2026.09.15',accuracy:'94.8',loss:'0.164',note:'해양사고 재결서 이해 성능 개선 및 최신 법령 반영'},{id:'haesim-llm-v2.2',date:'2026.09.01',accuracy:'92.6',loss:'0.208',note:'질의응답 데이터 보강 및 응답 품질 개선'},{id:'haesim-llm-v2.1',date:'2026.08.18',accuracy:'90.2',loss:'0.251',note:'해양사고 도메인 기본 학습 모델'}],
  backups:[{id:'BK-001',name:'haesim-llm-v2.3 정기 백업',date:'2026.09.16 03:00',size:'14.2 GB',status:'완료'}],
  settings:{maxFile:'50',extensions:'PDF, HWP, HWPX, DOCX, TXT',maxFiles:'10',inputTokens:'8192',outputTokens:'4096',masking:true,endpoint:'https://ai.internal.example/v1',gpu:'NVIDIA A100 · 80 GB × 2',image:'haesim/inference:2.3.0',timeout:'120',autoscale:true},
  prompt:'당신은 해양안전심판 업무를 지원하는 AI 어시스턴트입니다.\n재결서와 관련 법령을 근거로 정확하고 명료하게 답변하세요.\n답변에는 사건번호와 출처를 함께 표시하고, 근거가 부족한 경우 이를 명확히 안내하세요.',
};
let state;
let storageAvailable = true;
try { state = JSON.parse(localStorage.getItem('haesim-design-v1')) || structuredClone(initialState); } catch { state = structuredClone(initialState); storageAvailable = false; }
const persist = () => { try {localStorage.setItem('haesim-design-v1', JSON.stringify(state));} catch {storageAvailable=false;} };
const main = document.querySelector('main');
const dialog = document.querySelector('#detail-dialog');
let route='dashboard', search='', filter='전체 상태', typeFilter='전체', page=1, selected=new Set();
let toastTimer;
function toast(message) { const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3400); }
function badge(status) {const color = /완료|활성|운영|안내/.test(status)?'green':/학습 중|전처리|진행/.test(status)?'purple':/검토|주의/.test(status)?'orange':/실패|중지/.test(status)?'red':'blue';return `<span class="badge ${color}">${escapeHTML(status)}</span>`;}
function button(text,action,ico='plus',primary=false,extra='') {return `<button type="button" class="button ${primary?'primary':''}" data-action="${action}" ${extra}>${icon(ico)}${text}</button>`;}
function heading(title,desc,actions='',eyebrow='SYSTEM MANAGEMENT') {return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div><div class="heading-actions">${actions}</div></div>`;}
function getTitle(id) {return groups.flatMap(g=>g.items).find(i=>i[0]===id)?.[1] || '운영 대시보드';}
function renderNavigation() {
  document.querySelector('#navigation').innerHTML=`<div class="nav-caption">WORKSPACE</div><a href="#dashboard" class="nav-link ${route==='dashboard'?'active':''}" ${route==='dashboard'?'aria-current="page"':''}>${icon('grid')}운영 대시보드</a><div class="nav-caption second">MANAGEMENT</div>`+groups.map((g,index)=>`<div class="nav-group ${g.items.some(i=>i[0]===route)?'open':''}"><button class="nav-group-title" data-group="${index}" aria-expanded="${g.items.some(i=>i[0]===route)}">${icon(g.icon)}${g.name}${icon('chevron').replace('<svg','<svg class="chevron"')}</button><div class="nav-children">${g.items.map(([id,label])=>`<a class="nav-child ${route===id?'active':''}" href="#${id}" ${route===id?'aria-current="page"':''}>${label}</a>`).join('')}</div></div>`).join('');
}
function navigate() {
  const requested=location.hash.slice(1)||'dashboard';
  route=groups.flatMap(g=>g.items.map(i=>i[0])).includes(requested)?requested:'dashboard';
  search='';filter='전체 상태';typeFilter='전체';page=1;selected.clear();
  document.querySelector('#breadcrumb-title').textContent=getTitle(route);
  document.title=`${getTitle(route)} | 중해심 AI`;
  document.querySelector('#sidebar').classList.remove('mobile-open');document.querySelector('#sidebar-shade').classList.remove('show');
  renderNavigation();render();window.scrollTo(0,0);
}
function render() {
  if(route==='dashboard') main.innerHTML=dashboard();
  else if(['limits','infrastructure','prompt'].includes(route)) main.innerHTML=settingsPage();
  else if(['versions','trained-model'].includes(route)) main.innerHTML=versionsPage();
  else if(route==='training') main.innerHTML=trainingPage();
  else if(route==='version-register') main.innerHTML=versionForm();
  else if(route==='notification-register') main.innerHTML=notificationForm();
  else main.innerHTML=listPage();
}
function dashboard() {
  const stats=[['학습 데이터','24,862','건','↑ 128건','전일 대비 새로 수집','database'],['학습 완료 데이터','23,418','건','94.2%','전체 데이터 대비 정제율','shield'],['파인튜닝 작업',String(state.training.filter(t=>t.status==='학습 중').length),'건','진행 중','학습 상태를 확인하세요','brain'],['활성 모델','1','개',state.activeModel,'현재 서비스 모델','layers']];
  return heading('운영 대시보드','데이터부터 AI 모델까지, 시스템 운영 현황을 한눈에 확인하세요.',`<span class="period">${icon('calendar')} 2026.09.16 (수)</span>${button('새로고침','refresh','refresh')}`,'OVERVIEW')+
    `<section class="intro-banner"><div><div class="banner-pill"><span class="live-dot" style="margin:0;width:4px;height:4px;box-shadow:none"></span> AI OPERATION CENTER</div><h2>더 안전한 바다를 위한, <span>더 정교한 AI.</span></h2><p>해양안전심판 데이터와 AI의 모든 운영 흐름을 관리합니다.</p></div><div class="banner-art" aria-hidden="true"><div class="orbit"></div><div class="orbit two"></div><div class="ai-cube">AI</div><div class="art-node a">${icon('database')}</div><div class="art-node b">${icon('shield')}</div><span class="art-spark">✧</span></div></section>`+
    `<section class="stats-grid" aria-label="운영 요약">${stats.map((s,i)=>`<article class="stat-card"><div class="stat-top">${s[0]}<span class="stat-icon">${icon(s[5])}</span></div><div class="stat-value">${s[1]}<small>${s[2]}</small></div><div class="stat-note"><strong class="${i===2?'purple':i===3?'orange':''}">${escapeHTML(s[3])}</strong><span>${s[4]}</span></div></article>`).join('')}</section>`+
    `<div class="dashboard-columns"><section class="panel"><div class="panel-head"><div><h2 class="panel-title">데이터 수집 현황</h2><p class="panel-subtitle">최근 7일간 수집 및 전처리 완료 현황</p></div><a class="text-link" href="#collection">상세 보기 ${icon('chevron')}</a></div><div class="chart-legend"><span><i></i>수집 데이터</span><span><i class="teal"></i>전처리 완료</span></div>${chart()}<div class="chart-bottom"><span>최근 7일 총 수집 <b>913건</b></span><span>이전 7일 대비 <b>↗ 12.8%</b></span></div></section>
    <section class="panel"><div class="panel-head"><h2 class="panel-title">현재 운영 모델</h2>${badge('정상 운영')}</div><div class="model-content"><div class="model-identity"><span class="model-symbol">${icon('layers')}</span><div><h3>${escapeHTML(state.activeModel)}</h3><p>해양안전심판 특화 언어 모델</p></div></div><dl class="model-details"><div><dt>기반 모델</dt><dd>Llama 3.1 · 8B</dd></div><div><dt>배포 일자</dt><dd>${escapeHTML(state.versions.find(v=>v.id===state.activeModel)?.date || '2026.09.15')}</dd></div><div><dt>평균 응답 시간</dt><dd>1.24 sec</dd></div><div><dt>서비스 가용률</dt><dd>99.98%</dd></div></dl><div class="meter-label"><span>모델 평가 정확도</span><b>${escapeHTML(state.versions.find(v=>v.id===state.activeModel)?.accuracy||'—')}%</b></div><div class="meter"><span style="width:${Number(state.versions.find(v=>v.id===state.activeModel)?.accuracy)||0}%"></span></div><div class="model-foot">${icon('clock')} 성능 수치는 화면 구성을 위한 예시입니다.</div></div></section></div>
    <div class="dashboard-columns"><section class="panel"><div class="panel-head"><h2 class="panel-title">최근 수집 데이터 <span class="small-badge">최근 5건</span></h2><a class="text-link" href="#collection">전체 보기 ${icon('chevron')}</a></div><div class="table-wrap compact-table"><table><thead><tr><th>데이터명</th><th>유형</th><th>수집 일시</th><th>상태</th></tr></thead><tbody>${state.documents.slice(0,5).map(d=>`<tr><td><div class="table-name"><span class="file-icon">${icon('file')}</span><button class="data-title" data-action="detail" data-id="${d.id}">${escapeHTML(d.name)}<small class="data-subtitle">${escapeHTML(d.court)}</small></button></div></td><td>${d.type}</td><td>${d.date.slice(5)}</td><td>${badge(d.status)}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="panel"><div class="panel-head"><h2 class="panel-title">시스템 알림 <span class="small-badge">${state.alerts.filter(a=>!a.read).length}</span></h2><a href="#notifications" class="text-link">전체 보기 ${icon('chevron')}</a></div><div class="notice-list">${state.alerts.slice(0,4).map((n,i)=>`<article class="notice-item"><span class="notice-dot ${i===1?'orange':i===2?'teal':''}"></span><div><button data-action="alert-detail" data-id="${n.id}">${escapeHTML(n.title)}</button><p>${escapeHTML(n.kind)} <span>·</span> ${escapeHTML(n.date)}</p></div></article>`).join('')}</div></section></div>
    <div class="quick-links">${[['collection','database','학습 데이터 관리','데이터 수집부터 전처리까지'],['training','brain','파인튜닝 작업 실행','전문성 있는 AI 모델 학습'],['versions','layers','모델 버전 관리','안정적인 모델 배포와 운영']].map(s=>`<a class="quick-link" href="#${s[0]}">${icon(s[1])}<span><b>${s[2]}</b><small>${s[3]}</small></span>${icon('arrow')}</a>`).join('')}</div>`;
}
function chart(){
  const a=[102,130,111,154,122,166,128],b=[86,116,99,136,112,147,115];
  return `<div class="chart-area"><svg viewBox="0 0 640 185" preserveAspectRatio="none" role="img" aria-label="최근 7일 수집·전처리 건수 예시 막대 차트. 9월 16일 수집 128건, 전처리 115건.">${[0,1,2,3,4].map(i=>`<line x1="38" x2="628" y1="${18+i*33.75}" y2="${18+i*33.75}" class="chart-grid"/><text x="4" y="${21+i*33.75}" class="chart-axis">${200-i*50}</text>`).join('')}${a.map((n,i)=>`<rect x="${65+i*82}" y="${153-n*.675}" width="16" height="${n*.675}" rx="3" fill="#9c8ee7"/><rect x="${86+i*82}" y="${153-b[i]*.675}" width="16" height="${b[i]*.675}" rx="3" fill="#89c9c5"/><text x="${83+i*82}" y="177" text-anchor="middle" class="chart-axis">09.${10+i}</text>`).join('')}</svg></div>`;
}
const listConfig={
 collection:['데이터 수집/선별','학습에 활용할 재결서와 해양사고 데이터를 수집하고 선별합니다.','데이터 수집','collect','대상 데이터 식별·수집'],
 source:['원본/가공 데이터 관리','원본 문서와 전처리 결과를 구분하여 확인하고 관리합니다.','데이터 수집','collect','원본 보존 · 가공 데이터 분리'],
 preprocess:['전처리 작업 관리','문서 페이지를 분리하고 본문을 정제하여 학습 가능한 데이터로 만듭니다.','전처리 실행','preprocess','문서 페이지 분리 · 본문 정제'],
 metadata:['메타정보 관리','사건번호, 재결번호, 유형, 원인, 법령 등 문서의 핵심 정보를 관리합니다.','메타정보 편집','metadata-edit','사건번호 · 재결번호 · 유형 · 원인 · 법령'],
 tracking:['출처 추적','원문, 가공 데이터, 학습 데이터의 연결 관계를 추적합니다.','연결 내보내기','export','원문 → 가공본 → AI 활용 출처 연결'],
 labeling:['오토 라벨링','텍스트의 사고 유형과 주요 항목을 자동 분류하고 검토합니다.','자동 라벨링 실행','label','텍스트 항목별 라벨링'],
 dataset:['파인튜닝 데이터 관리','모델 학습과 검색에 사용하는 데이터 세트를 관리합니다.','데이터 세트 생성','dataset-create','파인튜닝 학습 · 일반 학습/검색 데이터'],
 schedule:['수집 스케줄 관리','데이터 수집 주기와 실행 상태를 관리합니다.','스케줄 등록','schedule-create','예약된 작업은 예시이며 실제로 실행되지 않습니다.'],
 history:['학습 이력 관리','파인튜닝 실행 결과와 학습 지표를 확인하고 저장합니다.','이력 내보내기','export','파인튜닝 이력 조회 · 이력 저장'],
 backup:['학습 모델 백업 관리','학습 모델 백업 현황과 모델 파일 정보를 관리합니다.','백업 생성','backup-create','모델 데이터 백업 · 보관 이력'],
 notifications:['알림 목록','시스템 운영 중 발생한 알림과 공지사항을 관리합니다.','알림 등록','new-alert','알림 상세 조회 · 등록 · 수정 · 삭제'],
};
function getRows(){
  if(route==='schedule')return state.schedules.map(x=>({...x,category:x.source,sub:x.id,cols:[x.source,x.cycle,x.last,badge(x.status)],action:'schedule-detail'}));
  if(route==='history')return state.training.map(x=>({...x,category:x.model,sub:x.id,cols:[x.model,x.date,x.loss,badge(x.status)],action:'training-detail'}));
  if(route==='backup')return state.backups.map(x=>({...x,category:'모델 백업',sub:x.id,cols:[x.size,x.date,'로컬 백업 스토리지',badge(x.status)],action:'backup-detail'}));
  if(route==='notifications')return state.alerts.map(x=>({...x,name:x.title,category:x.kind,status:x.level,sub:x.id,cols:[x.kind,x.date,badge(x.level),x.read?'읽음':'<span style="color:#8c78df">새 알림</span>'],action:'alert-detail'}));
  if(route==='dataset')return [...(state.datasets||[]),{id:'DS-003',name:'재결서 학습 세트 v3',category:'파인튜닝',count:'18,420',date:'2026.09.15',status:'완료'},{id:'DS-002',name:'법령 QA 세트 v2',category:'파인튜닝',count:'4,998',date:'2026.09.14',status:'완료'},{id:'DS-001',name:'해양사고 검색 코퍼스',category:'일반 학습/검색',count:'24,862',date:'2026.09.16',status:'완료'}].map(x=>({...x,sub:x.id,cols:[x.category,x.count+'건',x.date,badge(x.status)],action:'dataset-detail'}));
  return state.documents.map(d=>{let cols=[d.type,d.court,d.date,badge(d.status)];
    if(route==='source')cols=[d.type,typeFilter==='가공 데이터'?'JSONL · 정제 텍스트':d.size,d.date,badge(d.status)];
    if(route==='metadata')cols=[d.caseNo,d.label,d.court,badge(d.status)];
    if(route==='tracking')cols=[d.id.replace('DOC','RAW'),d.id.replace('DOC','CLN'),d.status==='완료'?'재결서 학습 세트 v3':'연결 대기',badge(d.status==='완료'?'연결 완료':'대기')];
    if(route==='labeling')cols=[d.label,d.status==='완료'?'96.4%':'검토 전',d.court,badge(d.status)];
    if(route==='preprocess')cols=[`${d.pages}쪽`,d.status==='완료'?'페이지 분리 · 본문 정제':'본문 정제 대기',d.date,badge(d.status)];
    return {...d,sub:d.id,category:d.type,cols,action:'detail'};
  });
}
function listPage(){
  const c=listConfig[route];
  const tabs=route==='source'?['전체','원본 데이터','가공 데이터']:route==='dataset'?['전체','파인튜닝','일반 학습/검색']:route==='notifications'?['전체','데이터','인프라','모델']:['전체','재결서','조사보고서','법령'];
  const showTabs=!['schedule','history','backup'].includes(route);
  const statuses=route==='schedule'?['활성','중지']:route==='notifications'?['안내','주의']:route==='history'?['학습 중','완료','중지']:['완료','전처리 중','검토 필요','대기'];
  return heading(c[0],c[1],button(c[2],c[3],c[3]==='export'?'download':'plus',true))+
   `<div class="section-description">${icon('info')} ${c[4]}</div>`+
   (route==='preprocess'?`<div class="pipeline">${[['01','원본 문서','문서 형식 및 무결성 확인'],['02','페이지 분리','문단·표 구조 추출'],['03','본문 정제','중복 제거 및 텍스트 정규화'],['04','학습 데이터','검증 완료 데이터 저장']].map(x=>`<div class="pipeline-step"><span class="step-number">${x[0]}</span><div><b>${x[1]}</b><small>${x[2]}</small></div></div>`).join('')}</div>`:'')+
   `<section class="panel">${showTabs?`<div class="tabs" role="tablist" aria-label="데이터 분류">${tabs.map(t=>`<button class="tab ${typeFilter===t?'active':''}" role="tab" aria-selected="${typeFilter===t}" data-tab="${t}">${t}</button>`).join('')}</div>`:''}<div class="filter-bar"><div class="search-box">${icon('search')}<input id="search-input" type="search" placeholder="${route==='notifications'?'알림 제목':'이름 또는 식별번호'} 검색" aria-label="목록 검색" value="${escapeHTML(search)}"></div><select id="status-filter" aria-label="상태 필터"><option>전체 상태</option>${statuses.map(s=>`<option ${s===filter?'selected':''}>${s}</option>`).join('')}</select><div class="filter-extra">${button('필터 초기화','reset-filter','refresh')}${button('CSV 내보내기','export','download')}</div></div><div id="list-results">${listResults()}</div></section>`;
}
function filteredRows(){return getRows().filter(x=>(!search || (x.name+' '+x.id+' '+(x.caseNo||'')).toLowerCase().includes(search.toLowerCase()))&&(filter==='전체 상태'||x.status===filter)&&(typeFilter==='전체'||route==='source'||x.category===typeFilter));}
function listResults(){
  const rows=filteredRows(),limit=6,count=Math.max(1,Math.ceil(rows.length/limit));page=Math.min(page,count);
  const visible=rows.slice((page-1)*limit,page*limit);
  const headings=route==='metadata'?['사건·재결번호','사고 유형','관할 기관','상태']:route==='tracking'?['원문 식별번호','가공본 식별번호','연결된 학습 데이터','연결 상태']:route==='labeling'?['예측 라벨','신뢰도','관할 기관','검토 상태']:route==='preprocess'?['페이지 수','작업 내용','등록 일시','상태']:route==='source'?['유형','파일 정보','수집 일시','상태']:route==='schedule'?['수집 소스','실행 주기','최근 실행','상태']:route==='history'?['대상 모델','시작 일시','최종 Loss','상태']:route==='backup'?['파일 크기','백업 일시','저장 위치','상태']:route==='notifications'?['분류','등록 일시','중요도','확인']:route==='dataset'?['데이터 용도','데이터 수','생성 일자','상태']:['유형','관할 기관','수집 일시','상태'];
  return `<div class="list-meta"><span>총 <strong>${rows.length}</strong>건 <span style="margin-left:12px">${selected.size?selected.size+'건 선택됨':'예시 데이터'}</span></span><span>최근 업데이트 2026.09.16 09:42</span></div><div class="table-wrap"><table><thead><tr><th style="width:42px"><input type="checkbox" id="select-all" aria-label="현재 페이지 전체 선택" ${visible.length&&visible.every(x=>selected.has(x.id))?'checked':''}></th><th>${route==='notifications'?'알림 제목':route==='history'?'학습 작업명':'이름'}</th>${headings.map(h=>`<th>${h}</th>`).join('')}<th>관리</th></tr></thead><tbody>${visible.map(x=>`<tr><td><input type="checkbox" data-select="${x.id}" aria-label="${escapeHTML(x.name)} 선택" ${selected.has(x.id)?'checked':''}></td><td><button class="data-title" data-action="${x.action}" data-id="${x.id}">${escapeHTML(x.name)}<small class="data-subtitle">${x.sub}</small></button></td>${x.cols.map((v,i)=>`<td>${(route==='notifications'?i>=2:i===3)?v:escapeHTML(v)}</td>`).join('')}<td><button class="text-link" data-action="${x.action}" data-id="${x.id}">상세 ${icon('chevron')}</button></td></tr>`).join('')||`<tr><td colspan="7"><div class="empty-state">검색 결과가 없습니다.<br><br>검색어 또는 필터를 변경해 주세요.</div></td></tr>`}</tbody></table></div><div class="table-footer"><span>${rows.length?((page-1)*limit+1):0}–${Math.min(page*limit,rows.length)} / ${rows.length}건</span><div class="pagination"><button data-page="${page-1}" aria-label="이전 페이지" ${page===1?'disabled':''}>‹</button>${Array.from({length:count},(_,i)=>`<button data-page="${i+1}" class="${page===i+1?'current':''}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}<button data-page="${page+1}" aria-label="다음 페이지" ${page===count?'disabled':''}>›</button></div><span>6개씩 보기</span></div>`;
}
function refreshResults(){document.querySelector('#list-results').innerHTML=listResults();}
function field(label,name,value,hint='',type='text'){return `<label class="field"><span>${label}</span><input type="${type}" name="${name}" value="${escapeHTML(value)}" required ${type==='number'?'min="1" max="1000000"':''}>${hint?`<small>${hint}</small>`:''}</label>`;}
function toggle(label,name,checked,desc){return `<label class="switch-row"><span>${label}<small>${desc}</small></span><input type="checkbox" class="switch" name="${name}" ${checked?'checked':''}></label>`;}
function settingsPage(){
  const s=state.settings,isPrompt=route==='prompt',isLimits=route==='limits';
  const title=isPrompt?'프롬프트 관리':isLimits?'첨부파일·입출력 제한':'AI 인프라·패키징 설정';
  const fields=isPrompt?`<label class="field"><span>시스템 프롬프트</span><textarea name="prompt" style="min-height:225px" required>${escapeHTML(state.prompt)}</textarea><small>AI 응답의 역할, 근거 제시 방식, 표현 기준을 정의합니다.</small></label>${toggle('질의 맥락 자동 보강','context',state.context!==false,'관련 재결서와 법령 문맥을 질의에 자동으로 추가합니다.')}<label class="field" style="margin-top:20px"><span>맥락 보강 규칙</span><textarea name="contextRule">${escapeHTML(state.contextRule||'사건번호가 포함된 경우 해당 재결서를 우선 검색합니다.\n법령 질의는 최신 시행일을 기준으로 맥락을 보강합니다.')}</textarea></label>`:
    isLimits?`<div class="field-row">${field('파일당 최대 크기 (MB)','maxFile',s.maxFile,'1 ~ 1,000 MB','number')}${field('동시 첨부파일 수','maxFiles',s.maxFiles,'1회 요청 기준','number')}</div>${field('허용 파일 형식','extensions',s.extensions,'쉼표로 구분하여 입력하세요.')}<div class="field-row">${field('최대 입력 토큰','inputTokens',s.inputTokens,'모델의 컨텍스트 한도를 고려해 설정합니다.','number')}${field('최대 출력 토큰','outputTokens',s.outputTokens,'답변 생성에 사용할 최대 토큰 수','number')}</div>${toggle('민감정보 마스킹','masking',s.masking,'문서에서 식별된 개인정보를 학습 데이터에서 마스킹합니다.')}`:
    `${field('추론 API 엔드포인트','endpoint',s.endpoint,'화면 시안용 주소이며 API 요청은 전송하지 않습니다.','url')}${field('GPU 리소스','gpu',s.gpu)}${field('컨테이너 이미지','image',s.image)}${field('요청 제한 시간 (초)','timeout',s.timeout,'제한 시간을 초과한 요청은 종료합니다.','number')}${toggle('자동 확장 사용','autoscale',s.autoscale,'부하에 따라 추론 인스턴스를 자동으로 확장합니다.')}`;
  return heading(title,isPrompt?'AI 답변의 기준과 질의 맥락 보강 규칙을 관리합니다.':'안정적인 AI 서비스 운영을 위한 정책과 리소스를 설정합니다.')+`<div class="form-grid"><form class="panel form-panel" id="settings-form"><h2>${isPrompt?'시스템 프롬프트 및 보강 규칙':isLimits?'파일 및 토큰 제한 정책':'AI 서비스 인프라'}</h2><p>변경 사항을 확인한 후 저장해 주세요.</p>${fields}<div class="form-actions">${button('기본값으로 복원','settings-reset','refresh')}<button type="submit" class="button primary">${icon('check')}설정 저장</button></div></form><aside class="panel form-panel"><h2>${isPrompt?'프롬프트 작성 가이드':'운영 가이드'}</h2><p>일관된 서비스 품질을 위한 설정 기준입니다.</p><ul class="info-list"><li>${icon('shield')}<span><b>명확한 운영 기준</b><br>${isPrompt?'응답 역할과 참고할 자료의 범위를 구체적으로 정의하세요.':'서비스 사용 패턴과 모델의 처리 한도에 맞게 값을 설정하세요.'}</span></li><li>${icon('link')}<span><b>출처 기반의 신뢰성</b><br>재결서와 법령의 출처를 확인할 수 있도록 응답 정책을 유지하세요.</span></li><li>${icon('info')}<span><b>프로토타입 저장 안내</b><br>설정은 현재 브라우저에만 저장됩니다. 실제 운영 서버에는 적용되지 않습니다.</span></li></ul><div class="resource-card"><div><span>설정 대상</span><b>${escapeHTML(state.activeModel)}</b></div><div><span>변경 권한</span><b>시스템 관리자</b></div></div></aside></div>`;
}
function trainingPage(){return heading('학습 관리','학습 작업을 실행하고 파인튜닝 진행 상황을 확인합니다.',button('새 학습 실행','training-create','play',true))+`<div class="section-description">${icon('info')} 파인튜닝 실행 · 실행 상태 관리 — 진행률과 성능 지표는 시안용 예시입니다.</div><div class="status-summary"><div class="summary-chip">전체 작업<b>${state.training.length}</b></div><div class="summary-chip">학습 중<b>${state.training.filter(t=>t.status==='학습 중').length}</b></div><div class="summary-chip">학습 완료<b>${state.training.filter(t=>t.status==='완료').length}</b></div></div>${state.training.map(t=>`<section class="panel training-card"><div class="training-card-top"><div><h3>${escapeHTML(t.name)}</h3><p>${t.id} · ${escapeHTML(t.dataset)}</p></div>${badge(t.status)}</div><div class="training-metrics"><div><span>기반 모델</span><b style="font-size:12px">${escapeHTML(t.model)}</b></div><div><span>학습 Epoch</span><b>${t.epochs}</b></div><div><span>Training Loss</span><b>${t.loss}</b></div><div><span>시작 일시</span><b style="font-size:12px">${t.date}</b></div></div><div class="meter-label"><span>학습 진행률</span><b>${t.progress}%</b></div><div class="meter"><span style="width:${t.progress}%"></span></div><div class="form-actions">${button('실행 상세','training-detail','file',false,`data-id="${t.id}"`)}${t.status==='학습 중'?button('학습 중지','training-stop','close',false,`data-id="${t.id}"`):''}${t.status==='완료'?button('완료 모델 저장','training-save','download',false,`data-id="${t.id}"`):''}</div></section>`).join('')}`;}
function versionsPage(){return heading(getTitle(route),'모델의 버전별 성능을 비교하고 서비스에 사용할 모델을 설정합니다.',button('버전 등록','new-version','plus',true))+`<div class="section-description">${icon('layers')} ${route==='trained-model'?'학습 완료 모델 저장 · 모델 활성화 설정':'시스템·모델 버전 상세 조회 · 수정 · 삭제'} — 모델 활성화는 시안 내부에서만 반영됩니다.</div><div class="version-grid">${state.versions.map(v=>`<article class="panel version-card ${v.id===state.activeModel?'active':''}">${badge(v.id===state.activeModel?'활성 모델':'보관 중')}<h3>${escapeHTML(v.id)}</h3><p>${escapeHTML(v.note)}</p><dl><div><dt>평가 정확도</dt><dd>${escapeHTML(v.accuracy)}<small>%</small></dd></div><div><dt>Validation Loss</dt><dd>${escapeHTML(v.loss)}</dd></div><div><dt>등록 일자</dt><dd style="font-size:11px">${v.date}</dd></div><div><dt>기반 모델</dt><dd style="font-size:11px">Llama 3.1 · 8B</dd></div></dl>${button(v.id===state.activeModel?'현재 서비스 중':'이 모델 활성화','activate-model',v.id===state.activeModel?'check':'play',v.id!==state.activeModel,`data-id="${escapeHTML(v.id)}" ${v.id===state.activeModel?'disabled':''}`)}<button class="text-link" style="margin:14px auto 0" data-action="version-detail" data-id="${escapeHTML(v.id)}">버전 상세 보기 ${icon('chevron')}</button></article>`).join('')}</div><div class="panel form-panel"><h2>모델 운영 흐름</h2><p style="margin-bottom:0">학습 완료 → 성능 평가 → 버전 등록 → 모델 활성화 → 운영 모니터링</p></div>`;}
function versionForm(){return heading('시스템·모델 버전 등록','새로운 모델 버전과 변경 정보를 등록합니다.')+`<form id="version-form" class="panel form-panel" style="max-width:780px"><h2>버전 기본 정보</h2><p>모델 식별번호는 중복되지 않는 이름으로 입력하세요.</p>${field('모델 버전명','name','','예: haesim-llm-v2.4')}<div class="field-row">${field('평가 정확도 (%)','accuracy','95.0')}${field('Validation Loss','loss','0.152')}</div><label class="field"><span>변경 내용</span><textarea name="note" placeholder="학습 데이터 변경, 성능 개선 등 주요 변경 사항" required></textarea></label><div class="warning-note">화면 시안에서는 모델 메타정보만 등록합니다. 실제 모델 파일의 업로드 및 배포는 수행하지 않습니다.</div><div class="form-actions"><a href="#versions" class="button">취소</a><button type="submit" class="button primary">${icon('plus')}버전 등록</button></div></form>`;}
function notificationForm(item){return (item?'':heading('알림 등록','시스템 운영자에게 표시할 알림을 작성합니다.'))+`<form id="alert-form" ${item?`data-id="${item.id}"`:''} class="${item?'':'panel form-panel'}" style="max-width:780px">${field('알림 제목','title',item?.title||'')}<div class="field-row"><label class="field"><span>알림 분류</span><select name="kind">${['데이터','인프라','모델'].map(k=>`<option ${item?.kind===k?'selected':''}>${k}</option>`).join('')}</select></label><label class="field"><span>중요도</span><select name="level">${['안내','주의'].map(k=>`<option ${item?.level===k?'selected':''}>${k}</option>`).join('')}</select></label></div><label class="field"><span>알림 내용</span><textarea name="body" required placeholder="운영자가 확인할 내용을 입력하세요.">${escapeHTML(item?.body||'')}</textarea></label><p class="hint">등록한 알림은 현재 브라우저의 시안 화면에만 표시됩니다.</p><div class="form-actions">${item?'<button type="button" class="button" data-action="close-dialog">취소</button>':'<a href="#notifications" class="button">취소</a>'}<button type="submit" class="button primary">${icon('check')}${item?'변경 사항 저장':'알림 등록'}</button></div></form>`;}
function showDialog(title,body,foot='') {document.querySelector('#dialog-content').innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${escapeHTML(title)}</h2><button class="icon-button" data-action="close-dialog" aria-label="닫기">${icon('close')}</button></div><div class="dialog-body">${body}</div>${foot?`<div class="dialog-foot">${foot}</div>`:''}`;if(!dialog.open)dialog.showModal();}
function detailGrid(entries){return `<dl class="detail-grid">${entries.map(([k,v])=>`<dt>${k}</dt><dd>${escapeHTML(v)}</dd>`).join('')}</dl>`;}
function documentDetail(id){const d=state.documents.find(x=>x.id===id);if(!d)return;
 showDialog(route==='tracking'?'데이터 출처 연결':route==='metadata'?'문서 메타정보':route==='labeling'?'라벨링 결과 상세':'데이터 상세',`${badge(d.status)}<h3 style="font-size:17px;line-height:1.7">${escapeHTML(d.name)}</h3>${detailGrid([['문서 식별번호',d.id],['사건·재결번호',d.caseNo],['문서 유형',d.type],['관할 기관',d.court],['사고 유형',d.label],['수집 일시',d.date],['파일 정보',`${d.size} · ${d.pages}페이지`]])}${route==='tracking'?`<div class="document-preview"><b>출처 연결 관계</b><br>원문 ${d.id.replace('DOC','RAW')}<br>↓ 페이지 분리 및 본문 정제<br>가공본 ${d.id.replace('DOC','CLN')}<br>↓ ${d.status==='완료'?'재결서 학습 세트 v3 연결':'전처리 완료 후 연결 예정'}</div>`:`<div class="document-preview"><b>문서 내용 예시</b><br>본 문서는 해양사고 관련 사실관계, 사고 원인 및 적용 법령을 포함하는 재결서 예시입니다. 실제 사건과 무관한 시안용 데이터입니다.</div>`}`,button('메타정보 수정','metadata-edit','settings',false,`data-id="${d.id}"`)+button('닫기','close-dialog','close'));}
function now(){const d=new Date();return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}
function download(name,text,type='text/plain;charset=utf-8'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function confirmAction(title,message,action,id){showDialog(title,`<p>${escapeHTML(message)}</p>`,button('취소','close-dialog','close')+button('확인',action,'check',true,`data-id="${escapeHTML(id)}"`));}
document.addEventListener('click',event=>{
 const group=event.target.closest('[data-group]');if(group){const parent=group.parentElement;parent.classList.toggle('open');group.setAttribute('aria-expanded',parent.classList.contains('open'));return;}
 const tab=event.target.closest('[data-tab]');if(tab){typeFilter=tab.dataset.tab;page=1;selected.clear();render();return;}
 const pg=event.target.closest('[data-page]');if(pg){page=Number(pg.dataset.page);refreshResults();return;}
 const target=event.target.closest('[data-action]');if(!target)return;
 const action=target.dataset.action,id=target.dataset.id;
 if(action==='close-dialog'){dialog.close();return;}
 if(action==='refresh'){render();toast('예시 운영 현황을 새로 불러왔습니다.');}
 else if(action==='detail')documentDetail(id);
 else if(action==='reset-filter'){search='';filter='전체 상태';typeFilter='전체';page=1;selected.clear();render();}
 else if(action==='new-alert')location.hash='notification-register';
 else if(action==='new-version')location.hash='version-register';
 else if(action==='export'){
  const rows=filteredRows().filter(x=>!selected.size||selected.has(x.id));
  const csvCell=x=>'"'+String(x).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
  download(`haesim-${route}.csv`,'\uFEFF'+[['식별번호','이름','상태'],...rows.map(x=>[x.id,x.name,x.status])].map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast(`${rows.length}건을 CSV로 내보냈습니다.`);
 }
 else if(action==='collect')showDialog('학습 데이터 수집',`<form id="collect-form">${field('데이터명','name','','예: 어선 해성호 충돌사건')}<label class="field"><span>데이터 유형</span><select name="type"><option>재결서</option><option>조사보고서</option><option>법령</option></select></label><label class="field"><span>수집 기관</span><select name="court"><option>중앙해심</option><option>부산해심</option><option>인천해심</option><option>목포해심</option><option>동해해심</option></select></label><div class="warning-note">수집 과정을 체험하기 위한 예시 항목을 추가합니다. 외부 사이트에 접속하거나 파일을 전송하지 않습니다.</div><div class="form-actions"><button class="button primary" type="submit">${icon('plus')}예시 데이터 수집</button></div></form>`);
 else if(action==='preprocess'||action==='label'){
   if(!selected.size){toast('작업할 데이터를 먼저 선택해 주세요.');return;}
   const count=selected.size;state.documents.filter(d=>selected.has(d.id)).forEach(d=>d.status='완료');persist();render();toast(`${count}건 ${action==='label'?'라벨링':'전처리'} 완료 상태로 변경했습니다. (시뮬레이션)`);
 }
 else if(action==='metadata-edit'){
  const d=state.documents.find(x=>x.id===(id||[...selected][0]));if(!d){toast('수정할 데이터를 먼저 선택해 주세요.');return;}
  showDialog('메타정보 수정',`<form id="metadata-form" data-id="${d.id}">${field('사건·재결번호','caseNo',d.caseNo)}${field('사고 유형','label',d.label)}${field('관할 기관','court',d.court)}${field('사고 원인','cause',d.cause||'경계 소홀 (예시)')}${field('관련 법령','law',d.law||'해사안전 관련 법령 (예시)')}<div class="form-actions"><button class="button primary" type="submit">저장</button></div></form>`);
 }
 else if(action==='schedule-create')showDialog('수집 스케줄 등록',`<form id="schedule-form">${field('스케줄명','name','')}${field('수집 소스','source','중앙해양안전심판원')}<label class="field"><span>실행 주기</span><select name="cycle"><option>매일 09:00</option><option>매일 18:00</option><option>매주 월요일 06:00</option></select></label><p class="hint">화면 내 예약 항목만 등록되며 실제 예약 작업은 실행되지 않습니다.</p><div class="form-actions"><button class="button primary" type="submit">스케줄 등록</button></div></form>`);
 else if(action==='schedule-detail'){const s=state.schedules.find(x=>x.id===id);showDialog('수집 스케줄 상세',detailGrid([['스케줄명',s.name],['수집 소스',s.source],['실행 주기',s.cycle],['최근 실행',s.last],['상태',s.status]]),button(s.status==='활성'?'스케줄 중지':'스케줄 활성화','schedule-toggle','clock',true,`data-id="${id}"`));}
 else if(action==='schedule-toggle'){const s=state.schedules.find(x=>x.id===id);s.status=s.status==='활성'?'중지':'활성';persist();dialog.close();render();toast('스케줄 상태를 변경했습니다.');}
 else if(action==='dataset-create')showDialog('데이터 세트 생성',`<form id="dataset-form">${field('데이터 세트명','name','')}<label class="field"><span>데이터 용도</span><select name="category"><option>파인튜닝</option><option>일반 학습/검색</option></select></label><p class="hint">시안에서는 정제 완료된 예시 문서를 연결합니다.</p><div class="form-actions"><button class="button primary" type="submit">생성</button></div></form>`);
 else if(action==='dataset-detail'){const d=getRows().find(x=>x.id===id);showDialog('데이터 세트 상세',detailGrid([['이름',d.name],['용도',d.category],['데이터 수',d.count],['생성 일자',d.date],['형식','JSONL · instruction / input / output']]),button('닫기','close-dialog','close'));}
 else if(action==='training-create')showDialog('새 파인튜닝 학습',`<form id="training-form">${field('학습 작업명','name','해양사고 전문 학습')}<label class="field"><span>기반 모델</span><select name="model">${state.versions.map(v=>`<option>${escapeHTML(v.id)}</option>`).join('')}</select></label><label class="field"><span>학습 데이터 세트</span><select name="dataset"><option>재결서 학습 세트 v3</option><option>법령 QA 세트 v2</option>${(state.datasets||[]).filter(d=>d.category==='파인튜닝').map(d=>`<option>${escapeHTML(d.name)}</option>`).join('')}</select></label><div class="field-row">${field('학습 Epoch','epochs','3','','number')}${field('Learning rate','rate','0.0002')}</div><div class="warning-note">시안용 학습 작업을 생성합니다. 실제 GPU 자원을 사용하거나 모델을 학습하지 않습니다.</div><div class="form-actions"><button class="button primary" type="submit">${icon('play')}학습 실행</button></div></form>`);
 else if(action==='training-detail'){const t=state.training.find(x=>x.id===id);showDialog('파인튜닝 실행 상세',badge(t.status)+detailGrid([['작업명',t.name],['학습 모델',t.model],['데이터 세트',t.dataset],['진행률',t.progress+'%'],['Epoch',t.epochs],['Loss',t.loss]])+'<div class="document-preview"><b>실행 로그 예시</b><br>[INFO] 학습 데이터 검증 완료<br>[INFO] 모델 가중치 및 토크나이저 로드 완료<br>[INFO] 학습 상태: '+escapeHTML(t.status)+'</div>',button('이력 저장','history-save','download',false,`data-id="${id}"`)+(t.status==='학습 중'?button('학습 완료 시뮬레이션','training-complete','check',true,`data-id="${id}"`):''));}
 else if(action==='history-save'){download(id+'.json',JSON.stringify(state.training.find(t=>t.id===id),null,2),'application/json');toast('학습 이력을 JSON으로 저장했습니다.');}
 else if(action==='training-stop')confirmAction('학습 중지','이 예시 학습 작업을 중지 상태로 변경할까요?','training-stop-confirm',id);
 else if(action==='training-stop-confirm'||action==='training-complete'){const t=state.training.find(x=>x.id===id);t.status=action==='training-complete'?'완료':'중지';if(t.status==='완료'){t.progress=100;t.epochs=t.epochs.split('/').pop().trim()+' / '+t.epochs.split('/').pop().trim();t.loss='0.164';}persist();dialog.close();render();toast('학습 상태를 변경했습니다.');}
 else if(action==='training-save'){const t=state.training.find(x=>x.id===id);const modelId=t.model+'-ft-'+id.slice(-4);if(state.versions.some(v=>v.id===modelId)){toast('이미 저장된 학습 모델입니다.');return;}state.versions.unshift({id:modelId,date:now().slice(0,10),accuracy:'94.8',loss:t.loss,note:t.name+' 학습 완료 모델 (성능 예시)'});persist();toast('학습 완료 모델을 저장했습니다. 학습 모델 형상 관리에서 확인하세요.');}
 else if(action==='activate-model')confirmAction('운영 모델 변경',`${id} 모델을 시안의 활성 모델로 설정할까요?`,'activate-confirm',id);
 else if(action==='activate-confirm'){state.activeModel=id;persist();dialog.close();render();toast('시안의 활성 모델을 변경했습니다.');}
 else if(action==='version-detail'){const v=state.versions.find(x=>x.id===id);showDialog('모델 버전 상세',detailGrid([['모델명',v.id],['등록 일자',v.date],['평가 정확도',v.accuracy+'%'],['Validation Loss',v.loss],['변경 내용',v.note],['상태',v.id===state.activeModel?'활성 모델':'보관 중']]),button('수정','version-edit','settings',false,`data-id="${escapeHTML(id)}"`)+(id!==state.activeModel?button('삭제','version-delete','close',false,`data-id="${escapeHTML(id)}"`):''));}
 else if(action==='version-edit'){const v=state.versions.find(x=>x.id===id);showDialog('모델 버전 수정',`<form id="version-edit-form" data-id="${escapeHTML(id)}"><p>${escapeHTML(id)}</p>${field('평가 정확도 (%)','accuracy',v.accuracy)}${field('Validation Loss','loss',v.loss)}<label class="field"><span>변경 내용</span><textarea name="note" required>${escapeHTML(v.note)}</textarea></label><div class="form-actions"><button class="button primary" type="submit">저장</button></div></form>`);}
 else if(action==='version-delete')confirmAction('버전 삭제','현재 시안에서 이 보관 모델의 등록 정보를 삭제할까요?','version-delete-confirm',id);
 else if(action==='version-delete-confirm'){if(id===state.activeModel)return;state.versions=state.versions.filter(v=>v.id!==id);persist();dialog.close();render();toast('버전 정보를 삭제했습니다.');}
 else if(action==='backup-create'){state.backups.unshift({id:'BK-'+Date.now(),name:state.activeModel+' 수동 백업',date:now(),size:'14.2 GB',status:'완료'});persist();render();toast('백업 이력을 추가했습니다. (실제 파일 백업은 수행하지 않음)');}
 else if(action==='backup-detail'){const b=state.backups.find(x=>x.id===id);showDialog('백업 상세',detailGrid([['백업명',b.name],['백업 일시',b.date],['예시 파일 크기',b.size],['상태',b.status]])+'<p>모델 파일이 없는 화면 시안으로, 백업 이력 정보만 저장됩니다.</p>',button('백업 정보 다운로드','backup-download','download',true,`data-id="${id}"`));}
 else if(action==='backup-download'){download(id+'.json',JSON.stringify(state.backups.find(x=>x.id===id),null,2),'application/json');toast('백업 이력 정보를 다운로드했습니다.');}
 else if(action==='alert-detail'){const a=state.alerts.find(x=>x.id===id);a.read=true;persist();render();showDialog('시스템 알림 상세',badge(a.level)+`<h3>${escapeHTML(a.title)}</h3>`+detailGrid([['분류',a.kind],['등록 일시',a.date]])+`<div class="document-preview">${escapeHTML(a.body).replaceAll('\n','<br>')}</div>`,button('수정','alert-edit','settings',false,`data-id="${id}"`)+button('삭제','alert-delete','close',false,`data-id="${id}"`));}
 else if(action==='alert-edit')showDialog('알림 수정',notificationForm(state.alerts.find(a=>a.id===id)));
 else if(action==='alert-delete')confirmAction('알림 삭제','시안에 등록된 이 알림을 삭제할까요?','alert-delete-confirm',id);
 else if(action==='alert-delete-confirm'){state.alerts=state.alerts.filter(a=>a.id!==id);persist();dialog.close();render();toast('알림을 삭제했습니다.');}
 else if(action==='settings-reset'){if(route==='prompt'){state.prompt=initialState.prompt;state.context=true;delete state.contextRule;}else{const keys=route==='limits'?['maxFile','maxFiles','extensions','inputTokens','outputTokens','masking']:['endpoint','gpu','image','timeout','autoscale'];keys.forEach(k=>state.settings[k]=initialState.settings[k]);}persist();render();toast('현재 화면의 설정을 기본값으로 복원했습니다.');}
});
document.addEventListener('input',e=>{if(e.target.id==='search-input'){search=e.target.value;page=1;selected.clear();refreshResults();}});
document.addEventListener('change',e=>{
 if(e.target.id==='status-filter'){filter=e.target.value;page=1;selected.clear();refreshResults();}
 if(e.target.dataset.select){e.target.checked?selected.add(e.target.dataset.select):selected.delete(e.target.dataset.select);refreshResults();}
 if(e.target.id==='select-all'){filteredRows().slice((page-1)*6,page*6).forEach(x=>e.target.checked?selected.add(x.id):selected.delete(x.id));refreshResults();}
});
document.addEventListener('submit',e=>{
 e.preventDefault();const form=e.target,data=Object.fromEntries(new FormData(form)),id=form.dataset.id;
 if(Object.values(data).some(v=>typeof v==='string'&&!v.trim())){toast('공백만 입력할 수 없습니다. 내용을 확인해 주세요.');return;}
 if(form.id==='settings-form'){
  if(route==='prompt'){state.prompt=data.prompt;state.context=!!data.context;state.contextRule=data.contextRule;}
  else{if(route==='limits'&&Number(data.maxFile)>1000){toast('파일당 최대 크기는 1,000 MB 이하로 입력하세요.');return;}Object.assign(state.settings,data);if(route==='limits')state.settings.masking=!!data.masking;else state.settings.autoscale=!!data.autoscale;}
 }
 else if(form.id==='collect-form'){state.documents.unshift({id:'DOC-'+Date.now(),name:data.name,type:data.type,court:data.court,date:now(),status:'대기',size:'2.0 MB',caseNo:'검토 전',label:'미분류',pages:12});}
 else if(form.id==='metadata-form')Object.assign(state.documents.find(d=>d.id===id),data);
 else if(form.id==='schedule-form')state.schedules.unshift({id:'SCH-'+Date.now(),...data,last:'실행 전',status:'활성'});
 else if(form.id==='dataset-form'){state.datasets??=[];state.datasets.unshift({id:'DS-'+Date.now(),...data,count:String(state.documents.filter(d=>d.status==='완료').length),date:now().slice(0,10),status:'완료'});}
 else if(form.id==='training-form'){
  if(!(Number(data.rate)>0&&Number(data.rate)<1)||Number(data.epochs)>100){toast('학습률은 0 초과 1 미만, Epoch는 100 이하로 입력하세요.');return;}
  state.training.unshift({id:'FT-'+Date.now(),name:data.name,model:data.model,dataset:data.dataset,progress:0,status:'학습 중',date:now(),epochs:'0 / '+data.epochs,loss:'—',rate:data.rate});
 }
 else if(form.id==='version-form'||form.id==='version-edit-form'){
  if(!Number.isFinite(Number(data.accuracy))||Number(data.accuracy)<0||Number(data.accuracy)>100||!Number.isFinite(Number(data.loss))||Number(data.loss)<0){toast('정확도는 0~100, Loss는 0 이상의 숫자로 입력하세요.');return;}
  if(form.id==='version-form'){if(!/^[a-zA-Z0-9._-]+$/.test(data.name)){toast('모델명은 영문, 숫자, 점, 하이픈, 밑줄만 사용하세요.');return;}if(state.versions.some(v=>v.id===data.name)){toast('이미 등록된 모델 버전명입니다.');return;}state.versions.unshift({id:data.name,date:now().slice(0,10),accuracy:data.accuracy,loss:data.loss,note:data.note});}
  else Object.assign(state.versions.find(v=>v.id===id),data);
 }
 else if(form.id==='alert-form'){if(id)Object.assign(state.alerts.find(a=>a.id===id),data);else state.alerts.unshift({id:'NT-'+Date.now(),...data,date:now(),read:false});}
 else return;
 persist();dialog.close();if(form.id==='version-form')location.hash='versions';else if(form.id==='alert-form'&&!id)location.hash='notifications';else render();toast(storageAvailable?'저장했습니다. 변경 사항은 이 브라우저에만 반영됩니다.':'현재 화면에 반영했습니다. 브라우저 저장소를 사용할 수 없어 새로고침 시 초기화됩니다.');
});
document.querySelector('#home-icon').innerHTML=icon('home');document.querySelector('#notification-button').innerHTML=icon('bell');document.querySelector('#mobile-menu').innerHTML=icon('menu');
document.querySelector('#notification-button').onclick=()=>location.hash='notifications';
document.querySelector('#mobile-menu').onclick=()=>{document.querySelector('#sidebar').classList.toggle('mobile-open');document.querySelector('#sidebar-shade').classList.toggle('show');};
document.querySelector('#sidebar-shade').onclick=()=>{document.querySelector('#sidebar').classList.remove('mobile-open');document.querySelector('#sidebar-shade').classList.remove('show');};
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
window.addEventListener('hashchange',navigate);navigate();
