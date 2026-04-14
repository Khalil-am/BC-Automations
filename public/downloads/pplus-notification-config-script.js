/**
 * PIF PPlus Notification Import — Compact, self-contained
 * Run in DevTools console on https://pifpplus-dev.masterteam.sa
 *
 * Uses the PIF P+.html bilingual email template for all notifications.
 * Generates notification rows programmatically from the Notifications_Template.xlsx
 * patterns (Level / Logs / Level WF / Log WF sheets).
 */

(async () => {
  'use strict';

  // ══ AUTH ══
  const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const token = cu && cu.data && cu.data.token;
  const cs = localStorage.getItem('cacheSession') || '';
  const csr = localStorage.getItem('csr') || '';
  if (!token) { console.error('NOT LOGGED IN'); return; }

  const H = { 'Authorization': 'Bearer ' + token, 'access-token': cs, 'csr': csr, 'accept-language': 'en' };
  const JH = Object.assign({}, H, { 'Content-Type': 'application/json' });
  const API = '/Service/api';
  const DELAY = 120;
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // ══ EMAIL HTML (PIF branding) ══
  const GOLD = '#C3984D', TEXT = '#3a3a3a', SIG = '#555555';
  const HEADER_IMG = 'https://image2url.com/r2/bucket1/images/1775994922133-a8fe9385-8f5f-40ff-9de2-0b5e1bb059ce.png';
  const gold = s => '<span style="color:' + GOLD + ';font-weight:700;">' + s + '</span>';
  function hl(body) {
    if (!body) return '';
    let h = String(body).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    h = h.replace(/"([^"{}]+)"/g, (_,p)=>'"'+gold(p)+'"');
    h = h.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_,p)=>gold('{{'+p+'}}'));
    return h.replace(/\n/g,'<br>');
  }
  function emailHtml(ar, en) {
    return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e4e4e4;border-radius:8px;font-family:Cairo,sans-serif;">'
      + '<tr><td style="border-radius:8px 8px 0 0;overflow:hidden;padding:0;"><img src="'+HEADER_IMG+'" alt="PIF" width="600" style="display:block;width:100%;"></td></tr>'
      + '<tr><td style="padding:30px;">'
      + '<div dir="rtl" style="text-align:right;margin-bottom:30px;"><p style="font-size:14px;line-height:1.8;color:'+TEXT+';margin-bottom:10px;">'+hl(ar)+'</p>'
      + '<div style="margin-top:20px;font-size:14px;color:'+SIG+';line-height:1.6;"><p style="margin-bottom:5px;">مع خالص التحية</p><p>نظام إدارة المشاريع</p></div></div>'
      + '<div style="height:1px;background:#e0e0e0;margin:25px 0;"></div>'
      + '<div dir="ltr" style="text-align:left;margin-top:30px;"><p style="font-size:14px;line-height:1.8;color:'+TEXT+';margin-bottom:10px;">'+hl(en)+'</p>'
      + '<div style="margin-top:20px;font-size:14px;color:'+SIG+';line-height:1.6;"><p style="margin-bottom:5px;">Best regards</p><p>Project Management System</p></div></div>'
      + '</td></tr></table>';
  }

  // ══ NOTIFICATION ROW GENERATORS ══
  const L = (e,a) => 'Dear {{receiver}},\n\n' + e + ' To view the details, please click here: {{webUrl}}.';
  const Lar = (e) => 'عزيزي/عزيزتي {{receiver}}،\n\n' + e + ' للاطلاع على التفاصيل يرجى الضغط هنا {{webUrl}}.';

  // Level events (3)
  const LEVEL_ROWS = [
    { event:'When level created', en_email:L('Level {{Name}} has been created by {{userCausedEvent}}.'), ar_email:Lar('تم إنشاء المستوى {{Name}} بواسطة {{userCausedEvent}}.'), en_app:'Level {{Name}} has been created by {{userCausedEvent}}.', ar_app:'تم إنشاء المستوى {{Name}} بواسطة {{userCausedEvent}}.' },
    { event:'When level updated', en_email:L('Level {{Name}} has been updated by {{userCausedEvent}}.'), ar_email:Lar('تم تحديث المستوى {{Name}} بواسطة {{userCausedEvent}}.'), en_app:'Level {{Name}} has been updated by {{userCausedEvent}}.', ar_app:'تم تحديث المستوى {{Name}} بواسطة {{userCausedEvent}}.' },
    { event:'When level deleted', en_email:'Dear {{receiver}},\n\nLevel {{Name}} has been deleted by {{userCausedEvent}}.', ar_email:'عزيزي/عزيزتي {{receiver}}،\n\nتم حذف المستوى {{Name}} بواسطة {{userCausedEvent}}.', en_app:'Level {{Name}} has been deleted by {{userCausedEvent}}.', ar_app:'تم حذف المستوى {{Name}} بواسطة {{userCausedEvent}}.' },
  ];

  // Log events — generator for entity CRUD+progress+discussion
  function logRows(entityEn, entityAr, opts = {}) {
    const rows = [
      { event: `When ${entityEn.toLowerCase()} created`, en_email: L(`A new ${entityEn} "{{Title}}" for Level "{{Name}}" has been Added by "{{userCausedEvent}}".`), ar_email: Lar(`تم إضافة ${entityAr} جديد "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`), en_app:`A new ${entityEn} "{{Title}}" for Level "{{Name}}" has been Added by "{{userCausedEvent}}".`, ar_app:`تم إضافة ${entityAr} جديد "{{Title}}" للمستوى "{{Name}}" بواسطة "{{userCausedEvent}}".` },
      { event: `When ${entityEn.toLowerCase()} updated`, en_email: L(`The ${entityEn} "{{Title}}" for Level "{{Name}}" has been Updated by "{{userCausedEvent}}".`), ar_email: Lar(`تم تحديث ${entityAr} "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`), en_app:`The ${entityEn} "{{Title}}" for Level "{{Name}}" has been Updated by "{{userCausedEvent}}".`, ar_app:`تم تحديث ${entityAr} "{{Title}}" للمستوى "{{Name}}" بواسطة "{{userCausedEvent}}".` },
      { event: `When ${entityEn.toLowerCase()} deleted`, en_email: `Dear {{receiver}},\n\nThe ${entityEn} "{{Title}}" for Level "{{Name}}" has been Deleted by "{{userCausedEvent}}".`, ar_email:`عزيزي/عزيزتي {{receiver}}،\n\nتم حذف ${entityAr} "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`, en_app:`The ${entityEn} "{{Title}}" for Level "{{Name}}" has been Deleted by "{{userCausedEvent}}".`, ar_app:`تم حذف ${entityAr} "{{Title}}" للمستوى "{{Name}}" بواسطة "{{userCausedEvent}}".` },
    ];
    if (opts.progress) rows.push({ event: `When ${entityEn.toLowerCase()} progress update`, en_email: L(`The ${entityEn} progress "{{Title}}" for Level "{{Name}}" has been Updated by "{{userCausedEvent}}".`), ar_email: Lar(`تم تحديث انجاز ${entityAr} {{Title}} لمستوى {{Name}} بواسطة {{userCausedEvent}}`), en_app:`The ${entityEn} progress "{{Title}}" for Level "{{Name}}" has been Updated by "{{userCausedEvent}}".`, ar_app:`تم تحديث انجاز ${entityAr} {{Title}} لمستوى {{Name}} بواسطة {{userCausedEvent}}` });
    if (opts.discussion) rows.push({ event: `${entityEn} discussion created`, en_email: L(`The discussion "{{discussion}}" for the ${entityEn} "{{Title}}" at the level "{{Name}}" has been Added by "{{userCausedEvent}}".`), ar_email: Lar(`تم إضافة مناقشة "{{discussion}}" ${entityAr} {{Title}} على مستوى {{Name}} بواسطة {{userCausedEvent}}`), en_app:`The discussion "{{discussion}}" for the ${entityEn} "{{Title}}" at level "{{Name}}" has been added by "{{userCausedEvent}}".`, ar_app:`تم إضافة مناقشة "{{discussion}}" ${entityAr} {{Title}} على مستوى {{Name}} بواسطة {{userCausedEvent}}` });
    if (opts.closed) rows.push({ event: `when ${entityEn.toLowerCase()} closed`, en_email: `Dear {{receiver}},\n\nThe ${entityEn} "{{Title}}" for Level "{{Name}}" has been Closed by "{{userCausedEvent}}".`, ar_email: `عزيزي/عزيزتي {{receiver}}،\n\nتم إغلاق ${entityAr} "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`, en_app:`The ${entityEn} "{{Title}}" for Level "{{Name}}" has been Closed by "{{userCausedEvent}}".`, ar_app:`تم إغلاق ${entityAr} "{{Title}}" للمستوى "{{Name}}" بواسطة "{{userCausedEvent}}".` });
    if (opts.transferred) rows.push({ event: 'When risk transferred to issue', en_email: `Dear {{receiver}},\n\nThe Risk "{{Title}}" for Level "{{Name}}" has been transferred to issue by "{{userCausedEvent}}".`, ar_email: `عزيزي/عزيزتي {{receiver}}،\n\nتم تحويل خطر "{{Title}}" لتحدي للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`, en_app:`The Risk "{{Title}}" for Level "{{Name}}" has been transferred to issue by "{{userCausedEvent}}".`, ar_app:`تم تحويل خطر "{{Title}}" لتحدي للمستوى "{{Name}}" بواسطة "{{userCausedEvent}}".` });
    return rows;
  }

  const LOG_ROW_DEFINITIONS = {
    Tasks:                 logRows('Task', 'مهمة', { progress:true, discussion:true }),
    Deliverables:          logRows('Deliverable', 'مخرج', { progress:true, discussion:true }),
    MileStones:            logRows('Milestone', 'معلم', { progress:true, discussion:true }),
    Risks:                 [ ...logRows('Risk','خطر'), { event:'when risk closed', en_email:`Dear {{receiver}},\n\nThe Risk "{{Title}}" for Level "{{Name}}" has been Closed by "{{userCausedEvent}}".`, ar_email:`عزيزي/عزيزتي {{receiver}}،\n\nتم إغلاق خطر "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`, en_app:`Risk Closed`, ar_app:`تم إغلاق الخطر` }, { event:'When risk transferred to issue', en_email:`Dear {{receiver}},\n\nThe Risk "{{Title}}" for Level "{{Name}}" has been transferred to issue by "{{userCausedEvent}}".`, ar_email:`عزيزي/عزيزتي {{receiver}}،\n\nتم تحويل خطر "{{Title}}" لتحدي للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`, en_app:`Risk transferred`, ar_app:`تم تحويل الخطر` } ],
    Issues:                [ ...logRows('Issue','تحدي'), { event:'When issue closed', en_email:`Dear {{receiver}},\n\nThe Issue "{{Title}}" for Level "{{Name}}" has been Closed by "{{userCausedEvent}}".`, ar_email:`عزيزي/عزيزتي {{receiver}}،\n\nتم إغلاق تحدي "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`, en_app:`Issue Closed`, ar_app:`تم إغلاق التحدي` } ],
    Stakeholders:          logRows('Stakeholder', 'صاحب مصلحة'),
    Charter:               [{ event:'When charter created', en_email:L(`A new Charter for Level "{{Name}}" has been Added by "{{userCausedEvent}}".`), ar_email:Lar(`تم إضافة ميثاق جديد للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`), en_app:`New Charter added to "{{Name}}"`, ar_app:`تم إضافة ميثاق جديد للمستوى "{{Name}}"` }],
    'Deliverable Acceptance': [{ event:'When Deliverable Acceptance created', en_email:L(`A new Deliverable Acceptance for Level "{{Name}}" has been Added by "{{userCausedEvent}}".`), ar_email:Lar(`تم إضافة قبول مخرجات جديد للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`), en_app:`New Deliverable Acceptance`, ar_app:`قبول مخرجات جديد` }],
    'Progress Update':     [{ event:'When level Progress Updates added', en_email:L(`A new Progress Update for Level "{{Name}}" has been Added by "{{userCausedEvent}}".`), ar_email:Lar(`تم إضافة تحديث تقدم جديد للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`), en_app:`New Progress Update`, ar_app:`تحديث تقدم جديد` }],
    'Custom Log':          [
      { event:'When new log added to level', en_email:L(`A new Log "{{Title}}" for Level "{{Name}}" has been Added by "{{userCausedEvent}}".`), ar_email:Lar(`تم إضافة سجل جديد "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`), en_app:`New log "{{Title}}"`, ar_app:`سجل جديد "{{Title}}"` },
      { event:'When log updated', en_email:L(`The Log "{{Title}}" for Level "{{Name}}" has been Updated by "{{userCausedEvent}}".`), ar_email:Lar(`تم تحديث سجل "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`), en_app:`Log updated "{{Title}}"`, ar_app:`تم تحديث سجل "{{Title}}"` },
      { event:'When log deleted', en_email:`Dear {{receiver}},\n\nThe Log "{{Title}}" for Level "{{Name}}" has been Deleted by "{{userCausedEvent}}".`, ar_email:`عزيزي/عزيزتي {{receiver}}،\n\nتم حذف سجل "{{Title}}" للمستوى "{{Name}}" بواسطة {{userCausedEvent}}.`, en_app:`Log deleted "{{Title}}"`, ar_app:`تم حذف سجل "{{Title}}"` },
    ],
    'Phase Gate':          [
      { event:'When adopting a phase', en_email:L(`The Phase "{{PreviousPhaseGateName}}" for Level "{{Name}}" has been completed.`), ar_email:Lar(`تم اكتمال مرحلة "{{PreviousPhaseGateName}}" لمشروع "{{Name}}".`), en_app:`Phase "{{PreviousPhaseGateName}}" completed`, ar_app:`تم اكتمال مرحلة "{{PreviousPhaseGateName}}"` },
      { event:'When phase started', en_email:L(`The Phase "{{CurrentPhaseGateName}}" for Level "{{Name}}" has been started.`), ar_email:Lar(`تم بدء مرحلة "{{CurrentPhaseGateName}}" لمشروع "{{Name}}".`), en_app:`Phase "{{CurrentPhaseGateName}}" started`, ar_app:`تم بدء مرحلة "{{CurrentPhaseGateName}}"` },
    ],
  };

  // Log WF rows — generator per "action word"
  function wfRows(requestLabelEn, requestLabelAr, opts = {}) {
    const baseRows = [];
    const full = opts.full !== false; // include Terminated/Resubmitted
    baseRows.push({ event:'When Request Approved', en_email:L(`Your request to ${requestLabelEn} has been finally approved.`), ar_email:Lar(`تمت الموافقة النهائية على طلبك ل${requestLabelAr}.`), en_app:`Request "${requestLabelEn}" approved`, ar_app:`تمت الموافقة على ${requestLabelAr}` });
    baseRows.push({ event:'When Request Rejected', en_email:L(`The request to ${requestLabelEn} has been rejected by "{{userCausedEvent}}".`), ar_email:Lar(`تم رفض طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Request rejected`, ar_app:`تم رفض الطلب` });
    baseRows.push({ event:'When Request Returned', en_email:L(`The request to ${requestLabelEn} has been returned by "{{userCausedEvent}}".`), ar_email:Lar(`تم ارجاع طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Request returned`, ar_app:`تم إرجاع الطلب` });
    baseRows.push({ event:'When Request Started', en_email:L(`The request to ${requestLabelEn} has been submitted by "{{userCausedEvent}}".`), ar_email:Lar(`تم تقديم طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Request submitted`, ar_app:`تم تقديم الطلب` });
    if (full) {
      baseRows.push({ event:'When Request Terminated', en_email:L(`The request to ${requestLabelEn} has been Terminated by "{{userCausedEvent}}".`), ar_email:Lar(`تم إنهاء طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Request terminated`, ar_app:`تم إنهاء الطلب` });
      baseRows.push({ event:'When Request Resubmitted', en_email:L(`The request to ${requestLabelEn} has been resubmitted by "{{userCausedEvent}}".`), ar_email:Lar(`تم إعادة تقديم طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Request resubmitted`, ar_app:`تم إعادة تقديم الطلب` });
    }
    // Step-level (same 4 events with different wording)
    baseRows.push({ event:'When Step Approved', en_email:L(`The step for request ${requestLabelEn} has been approved by "{{userCausedEvent}}".`), ar_email:Lar(`تمت الموافقة على خطوة طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Step approved`, ar_app:`تمت الموافقة على الخطوة` });
    baseRows.push({ event:'When Step Rejected', en_email:L(`The step for request ${requestLabelEn} has been rejected by "{{userCausedEvent}}".`), ar_email:Lar(`تم رفض خطوة طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Step rejected`, ar_app:`تم رفض الخطوة` });
    baseRows.push({ event:'When Step Returned', en_email:L(`The step for request ${requestLabelEn} has been returned by "{{userCausedEvent}}".`), ar_email:Lar(`تم ارجاع خطوة طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Step returned`, ar_app:`تم إرجاع الخطوة` });
    baseRows.push({ event:'When Step Started', en_email:L(`The step for request ${requestLabelEn} has been submitted by "{{userCausedEvent}}".`), ar_email:Lar(`تم تقديم خطوة طلب ${requestLabelAr} بواسطة "{{userCausedEvent}}".`), en_app:`Step submitted`, ar_app:`تم تقديم الخطوة` });
    return baseRows;
  }

  // ══ EVENT NAME MATCHERS ══
  const EVT = {
    'When level created': /level created/i, 'When level updated': /level updated/i, 'When level deleted': /level deleted/i,
    'When task created': /task created/i, 'When task updated': /task updated/i, 'When task deleted': /task deleted/i, 'When task progress update': /task progress/i, 'Task discussion created': /task discussion/i,
    'When deliverable created': /deliverable created/i, 'When deliverable updated': /deliverable updated/i, 'When deliverable deleted': /deliverable deleted/i, 'When deliverable progress update': /deliverable progress/i, 'Deliverable discussion created': /deliverable discussion/i,
    'When milestone created': /milestone created/i, 'When milestone updated': /milestone updated/i, 'When milestone deleted': /milestone deleted/i, 'When milestone progress update': /milestone progress/i, 'Milestone discussion created': /milestone? discussion/i,
    'When risk created': /risk (added|created)/i, 'When risk updated': /risk updated/i, 'When risk deleted': /risk deleted/i, 'when risk closed': /risk closed/i, 'When risk transferred to issue': /risk transferred/i,
    'When issue created': /issue created/i, 'When issue updated': /issue updated/i, 'When issue deleted': /issue deleted/i, 'When issue closed': /issue closed/i,
    'When stakeholder created': /stakeholder created/i, 'When stakeholder updated': /stakeholder updated/i, 'When stakeholder deleted': /stakeholder deleted/i,
    'When charter created': /charter created/i,
    'When Deliverable Acceptance created': /deliverable acceptance/i,
    'When level Progress Updates added': /progress update/i,
    'When new log added to level': /new log|log added to level/i,
    'When log updated': /log updated/i, 'When log deleted': /log deleted/i,
    'When adopting a phase': /adopting a phase/i, 'When phase started': /phase started/i,
  };
  const WFEVT = {
    'When Request Approved':/accepted/i, 'When Request Rejected':/rejected/i, 'When Request Returned':/returned/i, 'When Request Started':/started/i, 'When Request Terminated':/terminated/i, 'When Request Resubmitted':/resubmitted/i,
    'When Step Approved':/accepted/i, 'When Step Rejected':/rejected/i, 'When Step Returned':/returned/i, 'When Step Started':/started/i,
  };

  // ══ TARGETS ══
  const LEVEL_MODULE_IDS = [2, 3, 4];  // Portfolio, Initiative, Other Project
  const LOG_GROUP_MODULES = {
    Tasks:[1], Deliverables:[2], MileStones:[3], Risks:[4], Issues:[5],
    Stakeholders:[6, 23], Charter:[11], 'Deliverable Acceptance':[7],
    'Progress Update':[8], 'Custom Log':[12], 'Phase Gate':[9],
  };
  const LOG_WF_DEFINITIONS = [
    { label:'Add Log',          labelEn:'add a log',          labelAr:'إضافة سجل',           patterns:[/^Create /i] },
    { label:'Update Log',       labelEn:'update a log',       labelAr:'تعديل سجل',           patterns:[/^Update (?!.*Progress)/i] },
    { label:'Delete Log',       labelEn:'delete a log',       labelAr:'حذف سجل',             patterns:[/^Delete /i] },
    { label:'Close Log',        labelEn:'close a log',        labelAr:'إغلاق سجل',           patterns:[/^Close /i, /^Create Closure/i] },
    { label:'Progress Log',     labelEn:'update log progress',labelAr:'تحديث إنجاز سجل',     patterns:[/ Progress$/i, / Progress Log/i] },
    { label:'Move PhaseGate',   labelEn:'move phase gate',    labelAr:'الانتقال بين المراحل',patterns:[/^Move .*PhaseGate/i] },
  ];
  const LEVEL_WF_PATTERN = /^Create (Portfolio|Initiative|Project| Operational Project)/i;

  // ══ API ══
  async function getEvents(scope) { return (await (await fetch(`${API}/notifications/${scope}/events`,{headers:H})).json()).data || []; }
  async function getReceivers(scope) {
    const d = await (await fetch(`${API}/notifications/${scope}/receivers`,{headers:H})).json();
    const out = [];
    const groups = d.data || [];
    const actors = groups.find(g=>g.groupName==='actors');
    const creator = actors && actors.items && actors.items.find(a=>a.id==='creator');
    if (creator) out.push({ id:String(creator.id), displayName:creator.displayName, type:'Actor' });
    const gEntry = groups.find(g=>g.groupName==='groups');
    const adminG = gEntry && gEntry.items && gEntry.items.find(g=>/^admin$/i.test(g.displayName));
    if (adminG) out.push({ id:String(adminG.id), displayName:adminG.displayName, type:'Group' });
    return out;
  }
  async function createTpl(eventId) {
    const j = await (await fetch(`${API}/notifications/events/${eventId}`,{method:'POST',headers:JH,body:JSON.stringify({name:'Default'})})).json();
    return j.code===1 ? j.data.id : null;
  }
  async function putTpl(id, payload) { return (await (await fetch(`${API}/notifications/templates/${id}`,{method:'PUT',headers:JH,body:JSON.stringify(payload)})).json()).code===1; }
  async function postRecv(id, receivers) { if (!receivers.length) return true; return (await (await fetch(`${API}/notifications/templates/${id}`,{method:'POST',headers:JH,body:JSON.stringify({receivers})})).json()).code===1; }

  async function process(label, scope, rows, matcher) {
    const out = { ok:0, fail:0 };
    console.log(`\n━━━ ${label} ━━━`);
    const events = await getEvents(scope);
    if (!events.length) { console.log('  ⚠ no events'); return out; }
    const recv = await getReceivers(scope);
    for (const row of rows) {
      const rx = matcher[row.event]; if (!rx) continue;
      const ev = events.find(e=>rx.test(e.displayName)); if (!ev) continue;
      const existing = ev.templates && ev.templates.find(t=>t.name==='Default');
      const tplId = existing ? existing.id : await createTpl(ev.id);
      if (!tplId) { out.fail++; continue; }
      const ok = await putTpl(tplId, {
        name:'Default',
        emailTemplate: emailHtml(row.ar_email, row.en_email),
        emailContentTranslatable:{ar:'',en:''},
        smsTemplate: row.en_app || null,
        appTemplate: { ar: row.ar_app || '', en: row.en_app || '' },
      });
      if (!(existing && existing.receivers && existing.receivers.length)) await postRecv(tplId, recv);
      if (ok) { out.ok++; console.log(`  ✓ [evt ${ev.id}/tpl ${tplId}] ${row.event}`); }
      else    { out.fail++; console.log(`  ✗ [evt ${ev.id}/tpl ${tplId}] ${row.event}`); }
      await sleep(DELAY);
    }
    return out;
  }

  // ══ RUN ══
  console.log('═══ PIF PPlus Notification Import ═══');
  const tally = [];

  // 1) Level events
  for (const lvl of LEVEL_MODULE_IDS) {
    const r = await process(`Level ${lvl}`, `level/${lvl}`, LEVEL_ROWS, EVT);
    tally.push({ scope:`Level/${lvl}`, ...r });
  }

  // 2) Log events
  for (const [group, mods] of Object.entries(LOG_GROUP_MODULES)) {
    const rows = LOG_ROW_DEFINITIONS[group] || [];
    for (const m of mods) {
      const r = await process(`Log [${group}] mod=${m}`, `levelLog/${m}`, rows, EVT);
      tally.push({ scope:`LevelLog/${m} (${group})`, ...r });
    }
  }

  // 3) Workflow events — Level WF + Log WF
  console.log('\n━━━ Loading workflows ━━━');
  const wfs = [];
  for (const lvl of [1,2,3,4]) {
    const j = await (await fetch(`${API}/workflowschema/workflowregistry?levelId=${lvl}`,{headers:H})).json();
    (j.data || []).forEach(w => wfs.push({id:w.id, name:w.name, levelId:lvl}));
  }
  console.log(`  Found ${wfs.length} workflows`);

  const levelWfRows = wfRows('create the level "{{Name}}"', 'لانشاء مستوى "{{Name}}"', { full:true });
  for (const wf of wfs) {
    if (!LEVEL_WF_PATTERN.test(wf.name)) continue;
    const r = await process(`LevelWF #${wf.id} ${wf.name}`, `workflow/${wf.id}`, levelWfRows, WFEVT);
    tally.push({ scope:`Workflow/${wf.id} (Level: ${wf.name})`, ...r });
  }

  for (const wf of wfs) {
    if (LEVEL_WF_PATTERN.test(wf.name)) continue;
    const def = LOG_WF_DEFINITIONS.find(d => d.patterns.some(p => p.test(wf.name)));
    if (!def) continue;
    const rows = wfRows(`${def.labelEn} ("${wf.name}")`, `${def.labelAr} ("${wf.name}")`, { full:true });
    const r = await process(`LogWF [${def.label}] #${wf.id} ${wf.name}`, `workflow/${wf.id}`, rows, WFEVT);
    tally.push({ scope:`Workflow/${wf.id} (${def.label}: ${wf.name})`, ...r });
  }

  console.log('\n═══ SUMMARY ═══');
  let okT = 0, failT = 0;
  for (const t of tally) {
    okT += t.ok; failT += t.fail;
    if (t.ok || t.fail) console.log(`  ${t.scope}: ok=${t.ok} fail=${t.fail}`);
  }
  console.log(`\n  TOTAL  ok=${okT}  fail=${failT}`);
  window.__pifNotifResult = { ok:okT, fail:failT, tally };
  return { ok:okT, fail:failT };
})();
