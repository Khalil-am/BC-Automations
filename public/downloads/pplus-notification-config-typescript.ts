/**
 * PIF PPlus Notification Import — TypeScript
 * Target:   https://pifpplus-dev.masterteam.sa
 * Source:   Notifications_Template.xlsx (Level, Logs, Level WF, Log WF)
 * Template: PIF P+.html  (Arabic + English bilingual email)
 *
 * HOW TO RUN
 *   1. Log in to pifpplus-dev in Chrome.
 *   2. Open DevTools → Console.
 *   3. Paste the contents of this file and press Enter.
 *
 * DISCOVERED ENDPOINTS (all under /Service/api)
 *   Level events:
 *     GET    /notifications/level/{levelModuleId}/events
 *     GET    /notifications/level/{levelModuleId}/receivers
 *     GET    /notifications/level/{levelModuleId}/properties?IsMultiLanguageEnabled=true
 *   Log events (per level-log):
 *     GET    /notifications/levelLog/{logModuleId}/events
 *     GET    /notifications/levelLog/{logModuleId}/receivers
 *   Workflow events (approvals / process builder):
 *     GET    /notifications/workflow/{workflowId}/events
 *     GET    /notifications/workflow/{workflowId}/receivers
 *   Template lifecycle (identical for all three scopes):
 *     POST   /notifications/events/{eventId}         body: {name}                     → returns {id}
 *     PUT    /notifications/templates/{templateId}   body: {name, emailTemplate, smsTemplate, appTemplate, emailContentTranslatable}
 *     POST   /notifications/templates/{templateId}   body: {receivers:[{id,displayName,type}]}
 *     DELETE /notifications/receivers/{receiverId}
 *     DELETE /notifications/templates/{templateId}
 */

type Channel = 'Email' | 'SMS' | 'App';
type ReceiverType = 'Role' | 'Group' | 'Actor';

interface NotifRow {
  group: string;
  event: string;
  subject: string | null;
  en_email: string | null;
  ar_email: string | null;
  en_app: string | null;
  ar_app: string | null;
}
interface Receiver { id: string; displayName: string; type: ReceiverType; }
interface EventInfo { id: number; displayName: string; moduleId?: number; templates: Array<{ id: number; name: string; receivers?: Array<{id: number; identifier: string}> }> }

/* ============================================================
 * NOTIFICATION DATA  (generated from Notifications_Template.xlsx)
 * ============================================================ */
const NOTIF_DATA: { Level: NotifRow[]; Logs: NotifRow[]; LevelWF: NotifRow[]; LogWF: NotifRow[] } =
/*__DATA_PLACEHOLDER__*/ null as unknown as any;

(async () => {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // AUTH
  // ────────────────────────────────────────────────────────────
  const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const token: string | undefined = cu?.data?.token;
  const cs = localStorage.getItem('cacheSession') || '';
  const csr = localStorage.getItem('csr') || '';
  if (!token) { console.error('NOT LOGGED IN — log into pifpplus-dev first.'); return; }

  const baseHeaders = {
    'Authorization': 'Bearer ' + token,
    'access-token': cs,
    'csr': csr,
    'accept-language': 'en',
  };
  const jsonHeaders = { ...baseHeaders, 'Content-Type': 'application/json' };
  const API = '/Service/api';
  const DELAY = 150;
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // ────────────────────────────────────────────────────────────
  // PIF BRAND — email HTML builder (matches PIF P+.html)
  // ────────────────────────────────────────────────────────────
  const GREEN = '#005C4D';
  const GOLD  = '#C3984D';
  const TEXT   = '#3a3a3a';
  const SIG    = '#555555';
  const HEADER_IMG = 'https://image2url.com/r2/bucket1/images/1775994922133-a8fe9385-8f5f-40ff-9de2-0b5e1bb059ce.png';

  const gold = (s: string) => `<span style="color:${GOLD};font-weight:700;">${s}</span>`;

  // Highlight template variables inside a body line (gold emphasis)
  function highlightBody(body: string): string {
    if (!body) return '';
    // Escape HTML then turn {{...}} and "..." into gold spans
    let html = body
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Gold the quoted "Title"/"Name" style references
    html = html.replace(/"([^"{}]+)"/g, (_m, p1) => `"${gold(p1)}"`);
    // Gold the {{...}} variables
    html = html.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_m, p1) => gold('{{' + p1 + '}}'));
    // Newlines → <br>
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function buildEmailHtml(ar: string, en: string): string {
    const arBody = highlightBody(ar);
    const enBody = highlightBody(en);
    return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e4e4e4;border-radius:8px;font-family:Cairo,sans-serif;">`
      + `<tr><td style="border-radius:8px 8px 0 0;overflow:hidden;padding:0;">`
      + `<img src="${HEADER_IMG}" alt="PIF" width="600" style="display:block;width:100%;"></td></tr>`
      + `<tr><td style="padding:30px;">`
      // Arabic Section
      + `<div dir="rtl" style="text-align:right;margin-bottom:30px;">`
      + `<p style="font-size:14px;line-height:1.8;color:${TEXT};margin-bottom:10px;">${arBody}</p>`
      + `<div style="margin-top:20px;font-size:14px;color:${SIG};line-height:1.6;">`
      + `<p style="margin-bottom:5px;">مع خالص التحية</p>`
      + `<p>نظام إدارة المشاريع</p></div></div>`
      // Divider
      + `<div style="height:1px;background-color:#e0e0e0;margin:25px 0;"></div>`
      // English Section
      + `<div dir="ltr" style="text-align:left;margin-top:30px;">`
      + `<p style="font-size:14px;line-height:1.8;color:${TEXT};margin-bottom:10px;">${enBody}</p>`
      + `<div style="margin-top:20px;font-size:14px;color:${SIG};line-height:1.6;">`
      + `<p style="margin-bottom:5px;">Best regards</p>`
      + `<p>Project Management System</p></div></div>`
      + `</td></tr></table>`;
  }

  // ────────────────────────────────────────────────────────────
  // LEVEL / LOG / WORKFLOW TARGETS  (discovered live via API)
  // ────────────────────────────────────────────────────────────
  // Which levels exist for events? Queried from /notifications/level/{id}/events
  // Level module IDs observed live in pifpplus-dev:
  //   2 = Portfolio          (events 39-41)
  //   3 = Initiative         (events 80-82)
  //   4 = Other Project      (events 121-123)
  //   1 = Strategic Project  (events empty — no events exposed)
  const LEVEL_IDS = [2, 3, 4];

  // Log module IDs — resolved from /notifications/levelLog/{id}/events
  // Mapping determined from Excel group → live API list
  const LOG_GROUP_TO_MODULE: Record<string, number[]> = {
    'Tasks':                 [1],
    'Deliverables':          [2],
    'MileStones':            [3],
    'Risks':                 [4],
    'Issues':                [5],
    'Stakeholders':          [6, 23],  // historical: 6. new 23
    'Charter':               [11],
    'Closure':               [],       // no event set exposed
    'Change Request':        [],       // no event set exposed
    'Deliverable Acceptance':[7],
    'Progress Update':       [8],
    'Custom Log':            [12],
    'Phase Gate':            [9],
  };

  // Phrase → API event-name tokens (substring match on displayName)
  const EVENT_MATCHERS: Record<string, RegExp> = {
    'When level created': /level created/i,
    'When level updated': /level updated/i,
    'When level deleted': /level deleted/i,
    'When task created': /task created/i,
    'When task updated': /task updated/i,
    'When task deleted': /task deleted/i,
    'When task progress update': /task progress/i,
    'When task discussion created': /task discussion/i,
    'When deliverable created': /deliverable created/i,
    'When deliverable updated': /deliverable updated/i,
    'When deliverable deleted': /deliverable deleted/i,
    'New Deliverable discussion created': /deliverable discussion/i,
    'When milestone created': /milestone created/i,
    'When milestone updated': /milestone updated/i,
    'When milestone deleted': /milestone deleted/i,
    'New Milestone discussion created': /milestone? discussion/i,
    'When risk added': /risk added|risk created/i,
    'When risk updated': /risk updated/i,
    'when risk closed': /risk closed/i,
    'When risk transferred to issue': /risk transferred/i,
    'When risk deleted': /risk deleted/i,
    'When issue created': /issue created/i,
    'When issue updated': /issue updated/i,
    'When issue closed': /issue closed/i,
    'When issue deleted': /issue deleted/i,
    'When Stakeholder created': /stakeholder created/i,
    'When Stakeholder updated': /stakeholder updated/i,
    'When Stakeholder deleted': /stakeholder deleted/i,
    'When charter created': /charter created/i,
    'When closure created': /closure created/i,
    'When Change Request created': /change request created/i,
    'When Deliverable Acceptance created': /deliverable acceptance/i,
    'When level Progress Updates added': /progress updates? (added|created)|level progress/i,
    'When new log added to level': /new log added|log added to level/i,
    'When log updated': /log updated/i,
    'When log deleted': /log deleted/i,
    'When adopting a phase': /adopting a phase|phase adopted/i,
    'When phase started': /phase started/i,
  };

  // Workflow events → API event matcher (same 4 per workflow, used for BOTH request + step)
  const WF_EVENT_MATCHERS: Record<string, RegExp> = {
    'When Request Approved':   /workflow accepted|accepted/i,
    'When Request Rejected':   /workflow rejected|rejected/i,
    'When Request Returned':   /workflow returned|returned/i,
    'When Request Started':    /workflow started|started/i,
    'When Request Terminated': /terminated/i,
    'When Request Resubmitted':/resubmitted|re-submitted/i,
    'When Step Approved':      /workflow accepted|accepted/i,
    'When Step Rejected':      /workflow rejected|rejected/i,
    'When Step Returned':      /workflow returned|returned/i,
    'When Step Started':       /workflow started|started/i,
  };

  // Log WF group → workflow name pattern
  const LOG_WF_GROUP_PATTERNS: Record<string, RegExp[]> = {
    'Add Log Request':              [/^Create (Task|Deliverable|Milestone|Risk|Issue|Stakeholder|Charter|Closure|Change|Progress|Contracts|Payment|Project Charter|Project Handover|Project Change|Deliverable Acceptance|Initiative Charter|Initiative Handover)/i],
    'Add Log Request - Steps':      [/^Create (Task|Deliverable|Milestone|Risk|Issue|Stakeholder|Charter|Closure|Change|Progress|Contracts|Payment|Project Charter|Project Handover|Project Change|Deliverable Acceptance|Initiative Charter|Initiative Handover)/i],
    'Update Log Request':           [/^Update (Task|Deliverable|Milestone|Risk|Issue|Stakeholder|Charter|Payment|Project Charter|Project Handover|Project Change|Contracts|Initiative Charter|Initiative Handover|Bulk)/i],
    'Update Log Request - Steps':   [/^Update (Task|Deliverable|Milestone|Risk|Issue|Stakeholder|Charter|Payment|Project Charter|Project Handover|Project Change|Contracts|Initiative Charter|Initiative Handover|Bulk)/i],
    'Delete Log Request':           [/^Delete (Task|Deliverable|Milestone|Risk|Issue|Stakeholder|Charter|Payment|Project Charter|Project Handover|Project Change|Contracts|Initiative Charter|Initiative Handover)/i],
    'Delete Log Request - Steps':   [/^Delete (Task|Deliverable|Milestone|Risk|Issue|Stakeholder|Charter|Payment|Project Charter|Project Handover|Project Change|Contracts|Initiative Charter|Initiative Handover)/i],
    'Close Log Request':            [/^Close (Risk|Issue)/i, /^Create Closure/i],
    'Close Log Request - Steps':    [/^Close (Risk|Issue)/i, /^Create Closure/i],
    'Update Progress Log Request':          [/Progress$| Progress /i],
    'Update Progress Log Request - Steps':  [/Progress$| Progress /i],
    'Move PhaseGate Request':               [/^Move .*PhaseGate/i],
    'Move PhaseGate Request - Steps':       [/^Move .*PhaseGate/i],
  };

  // Level WF group → workflow name pattern (Create / Update / Delete Level)
  const LEVEL_WF_GROUP_PATTERNS: Record<string, RegExp[]> = {
    'Create Level Request':          [/^Create (Portfolio|Initiative|Project| Operational Project)/i],
    'Create Level Request - Steps':  [/^Create (Portfolio|Initiative|Project| Operational Project)/i],
  };

  // ────────────────────────────────────────────────────────────
  // DEFAULT RECEIVERS  (resolved lazily per scope from API)
  // ────────────────────────────────────────────────────────────
  async function getDefaultReceivers(scopeUrl: string): Promise<Receiver[]> {
    const res = await fetch(`${API}/notifications/${scopeUrl}/receivers`, { headers: baseHeaders });
    const data = await res.json();
    const groups: any[] = data.data || [];
    const out: Receiver[] = [];
    // Prefer the "Creator" actor (system placeholder) — always available
    const actors = groups.find(g => g.groupName === 'actors');
    const creator = actors?.items?.find((a: any) => a.id === 'creator' || /creator/i.test(a.displayName));
    if (creator) out.push({ id: String(creator.id), displayName: creator.displayName, type: 'Actor' });
    // Also add admin group for safety
    const groupsEntry = groups.find(g => g.groupName === 'groups');
    const admin = groupsEntry?.items?.find((g: any) => /admin/i.test(g.displayName));
    if (admin) out.push({ id: String(admin.id), displayName: admin.displayName, type: 'Group' });
    return out;
  }

  // ────────────────────────────────────────────────────────────
  // CORE API WRAPPERS
  // ────────────────────────────────────────────────────────────
  async function getEvents(scopeUrl: string): Promise<EventInfo[]> {
    const r = await fetch(`${API}/notifications/${scopeUrl}/events`, { headers: baseHeaders });
    const j = await r.json();
    return j.data || [];
  }

  async function createTemplate(eventId: number, name: string): Promise<number | null> {
    const r = await fetch(`${API}/notifications/events/${eventId}`, {
      method: 'POST', headers: jsonHeaders, body: JSON.stringify({ name })
    });
    const j = await r.json();
    if (j.code !== 1) { console.warn('Create template failed', j); return null; }
    return j.data?.id ?? null;
  }

  async function updateTemplate(templateId: number, payload: object): Promise<boolean> {
    const r = await fetch(`${API}/notifications/templates/${templateId}`, {
      method: 'PUT', headers: jsonHeaders, body: JSON.stringify(payload)
    });
    const j = await r.json();
    return j.code === 1;
  }

  async function addReceivers(templateId: number, receivers: Receiver[]): Promise<boolean> {
    if (!receivers.length) return true;
    const r = await fetch(`${API}/notifications/templates/${templateId}`, {
      method: 'POST', headers: jsonHeaders, body: JSON.stringify({ receivers })
    });
    const j = await r.json();
    return j.code === 1;
  }

  // ────────────────────────────────────────────────────────────
  // PROCESSOR — for a given scope, create/overwrite each template
  // ────────────────────────────────────────────────────────────
  interface ProcessResult { ok: number; fail: number; details: any[] }
  async function processScope(
    scopeLabel: string,
    scopeUrl: string,
    rows: NotifRow[],
    matchers: Record<string, RegExp>
  ): Promise<ProcessResult> {
    const res: ProcessResult = { ok: 0, fail: 0, details: [] };
    console.log(`\n━━━ ${scopeLabel} ━━━`);
    const events = await getEvents(scopeUrl);
    if (!events.length) {
      console.log(`  ⚠ no events available — skipping`);
      return res;
    }
    const receivers = await getDefaultReceivers(scopeUrl);

    for (const row of rows) {
      const rx = matchers[row.event];
      if (!rx) { continue; }
      const ev = events.find(e => rx.test(e.displayName));
      if (!ev) {
        console.log(`  — skip (no event match): "${row.event}"`);
        continue;
      }
      // Reuse existing template "Default" if present, else create
      const existing = ev.templates?.find(t => t.name === 'Default');
      const tplId = existing?.id ?? await createTemplate(ev.id, 'Default');
      if (!tplId) { res.fail++; continue; }

      const emailHtml = buildEmailHtml(row.ar_email || '', row.en_email || '');
      const appAr = row.ar_app || '';
      const appEn = row.en_app || '';
      const smsText = row.en_app || row.ar_app || null;

      const ok = await updateTemplate(tplId, {
        name: 'Default',
        emailTemplate: emailHtml,
        emailContentTranslatable: { ar: '', en: '' },
        smsTemplate: smsText,
        appTemplate: { ar: appAr, en: appEn },
      });

      // Only add receivers if the template has none yet
      if (!existing?.receivers?.length) {
        await addReceivers(tplId, receivers);
      }

      if (ok) {
        res.ok++;
        console.log(`  ✓ [evt ${ev.id} / tpl ${tplId}] ${row.event}`);
      } else {
        res.fail++;
        console.log(`  ✗ [evt ${ev.id} / tpl ${tplId}] ${row.event}`);
      }
      res.details.push({ event: row.event, eventId: ev.id, templateId: tplId, ok });
      await sleep(DELAY);
    }
    return res;
  }

  // ────────────────────────────────────────────────────────────
  // RUN — Level, Logs, Level WF, Log WF
  // ────────────────────────────────────────────────────────────
  console.log('═══ PIF PPlus Notification Import ═══');
  const totalResults: { scope: string; ok: number; fail: number }[] = [];

  // 1) Level events — for each level module ID
  for (const lvl of LEVEL_IDS) {
    const r = await processScope(`Level ${lvl}`, `level/${lvl}`, NOTIF_DATA.Level, EVENT_MATCHERS);
    totalResults.push({ scope: `Level/${lvl}`, ok: r.ok, fail: r.fail });
  }

  // 2) Log events — for each log group's module IDs
  for (const row of NOTIF_DATA.Logs) {
    const modules = LOG_GROUP_TO_MODULE[row.group] || [];
    for (const logMod of modules) {
      const key = `LevelLog/${logMod}`;
      // Aggregate by logMod so we don't re-fetch events per row
    }
  }
  // Process logs — one pass per (module, row) to ensure each event row tried
  const logModsSeen = new Set<number>();
  for (const row of NOTIF_DATA.Logs) {
    const modules = LOG_GROUP_TO_MODULE[row.group] || [];
    for (const m of modules) logModsSeen.add(m);
  }
  for (const logMod of logModsSeen) {
    const rowsForMod = NOTIF_DATA.Logs.filter(r => (LOG_GROUP_TO_MODULE[r.group] || []).includes(logMod));
    const r = await processScope(`Log ${logMod}`, `levelLog/${logMod}`, rowsForMod, EVENT_MATCHERS);
    totalResults.push({ scope: `LevelLog/${logMod}`, ok: r.ok, fail: r.fail });
  }

  // 3) Workflow events — Level WF + Log WF (all workflows across all levels)
  console.log('\n━━━ Loading workflows across all levels ━━━');
  const allWorkflows: Array<{ id: number; name: string; levelId: number }> = [];
  for (const lvl of [1, 2, 3, 4]) {
    const r = await fetch(`${API}/workflowschema/workflowregistry?levelId=${lvl}`, { headers: baseHeaders });
    const j = await r.json();
    (j.data || []).forEach((w: any) => allWorkflows.push({ id: w.id, name: w.name, levelId: lvl }));
  }
  console.log(`  Found ${allWorkflows.length} workflows`);

  // Level WF — workflows whose name starts with "Create <LevelName>"
  for (const wf of allWorkflows) {
    if (!/^Create (Portfolio|Initiative|Project| Operational Project)/i.test(wf.name)) continue;
    const r = await processScope(`Level WF: ${wf.name} (#${wf.id})`, `workflow/${wf.id}`, NOTIF_DATA.LevelWF, WF_EVENT_MATCHERS);
    totalResults.push({ scope: `Workflow/${wf.id} (${wf.name})`, ok: r.ok, fail: r.fail });
  }

  // Log WF — match by group pattern
  for (const wf of allWorkflows) {
    // Skip if already processed by level-wf step
    if (/^Create (Portfolio|Initiative|Project| Operational Project)$/i.test(wf.name)) continue;
    // Figure out which Log WF group this workflow fits
    let rows: NotifRow[] = [];
    for (const [groupName, patterns] of Object.entries(LOG_WF_GROUP_PATTERNS)) {
      if (patterns.some(p => p.test(wf.name))) {
        rows = rows.concat(NOTIF_DATA.LogWF.filter(r => r.group === groupName));
      }
    }
    if (!rows.length) continue;
    const r = await processScope(`Log WF: ${wf.name} (#${wf.id})`, `workflow/${wf.id}`, rows, WF_EVENT_MATCHERS);
    totalResults.push({ scope: `Workflow/${wf.id} (${wf.name})`, ok: r.ok, fail: r.fail });
  }

  // ────────────────────────────────────────────────────────────
  // REPORT
  // ────────────────────────────────────────────────────────────
  console.log('\n═══ SUMMARY ═══');
  let totalOk = 0, totalFail = 0;
  for (const t of totalResults) {
    totalOk += t.ok; totalFail += t.fail;
    if (t.ok || t.fail) console.log(`  ${t.scope}: ok=${t.ok}  fail=${t.fail}`);
  }
  console.log(`\n  TOTAL ok=${totalOk}  fail=${totalFail}`);
  return { totalOk, totalFail, details: totalResults };
})();
