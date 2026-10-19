# Packaged-source excerpts

All excerpts are inert text from the identified shipped ASAR. Byte ranges are zero-based and end-exclusive. Interpretation is in `ledger.md`; these snippets do not establish runtime execution.

## S1 — Disclosure labels, count, denied badge, accessible toggle

Source: `collapsed-turn-disclosure-5ab38617e1bb.js`; source bytes [396, 4227); ASAR bytes [136266049, 136269880).

```javascript
function y(e){let t=(0,x.c)(17),{collapsedMessageCount:r,workedDurationMs:i,workedForItem:a,className:o}=e;if(a!=null){let e;return t[0]!==o||t[1]!==a.completedAtMs||t[2]!==a.startedAtMs||t[3]!==a.status?(e=(0,S.jsx)(h,{className:o,status:a.status,startedAtMs:a.startedAtMs,completedAtMs:a.completedAtMs}),t[0]=o,t[1]=a.completedAtMs,t[2]=a.startedAtMs,t[3]=a.status,t[4]=e):e=t[4],e}if(i!=null){let e=o??`text-tertiary`,r;t[5]===i?r=t[6]:(r=p(i),t[5]=i,t[6]=r);let a;t[7]===r?a=t[8]:(a=(0,S.jsx)(n,{id:`localConversation.workedFor`,defaultMessage:`Worked for {time}`,description:`Divider shown between agent activity and the final assistant response in a completed turn`,values:{time:r}}),t[7]=r,t[8]=a);let s;return t[9]!==e||t[10]!==a?(s=(0,S.jsx)(`span`,{className:e,children:a}),t[9]=e,t[10]=a,t[11]=s):s=t[11],s}let s=o??`text-tertiary`,c;t[12]===r?c=t[13]:(c=(0,S.jsx)(n,{id:`localConversation.previousMessagesSummary`,defaultMessage:`{count, plural, one {# previous message} other {# previous messages}}`,description:`Summary shown in collapsed turns when no worked-for duration is available`,values:{count:r}}),t[12]=r,t[13]=c);let l;return t[14]!==s||t[15]!==c?(l=(0,S.jsx)(`span`,{className:s,children:c}),t[14]=s,t[15]=c,t[16]=l):l=t[16],l}function b(e){let r=(0,x.c)(29),{label:i,collapsedMessageCount:o,deniedActionCount:s,workedDurationMs:l,workedForItem:d,isCollapsed:f,onFocus:p,onBlur:m,onPointerEnter:h,onPointerLeave:g,onToggle:_}=e,b=s===void 0?0:s,C=b>0&&`w-full`,w;r[0]===C?w=r[1]:(w=a(`inline-flex max-w-full flex-wrap text-size-chat`,C),r[0]=C,r[1]=w);let T=!f,E;r[2]!==o||r[3]!==i||r[4]!==l||r[5]!==d?(E=i??(0,S.jsx)(y,{className:`text-inherit`,collapsedMessageCount:o,workedDurationMs:l,workedForItem:d}),r[2]=o,r[3]=i,r[4]=l,r[5]=d,r[6]=E):E=r[6];let D;r[7]===E?D=r[8]:(D=(0,S.jsx)(`span`,{children:E}),r[7]=E,r[8]=D);let O=f?`rotate-0`:`rotate-90`,k;r[9]===O?k=r[10]:(k=a(`icon-2xs transition-transform duration-basic`,O),r[9]=O,r[10]=k);let A;r[11]===k?A=r[12]:(A=(0,S.jsx)(u,{className:k}),r[11]=k,r[12]=A);let j;r[13]===b?j=r[14]:(j=b>0?(0,S.jsx)(c,{closeOnTriggerClick:!0,tooltipContent:(0,S.jsx)(n,{id:`localConversation.deniedActionsTooltip`,defaultMessage:`{count, plural, one {Auto-review denied # action. View the action and why it was denied.} other {Auto-review denied # actions. View the actions and why they were denied.}}`,description:`Tooltip for the denied-action count beside Worked for. Clicking this part of the disclosure opens or closes the turn's activity, where denial details can be viewed.`,values:{count:b}}),children:(0,S.jsxs)(`span`,{className:`ms-auto inline-flex items-center gap-1 text-secondary`,"data-denied-action-count":!0,children:[(0,S.jsx)(v,{}),(0,S.jsx)(n,{id:`localConversation.deniedActionsCount`,defaultMessage:`{count, plural, one {# denied action} other {# denied actions}}`,description:`Historical number of actions denied by auto-review in this turn, shown beside Worked for. Approving a retry does not remove a past denial from this count.`,values:{count:b}})]})}):null,r[13]=b,r[14]=j);let M;r[15]!==m||r[16]!==p||r[17]!==h||r[18]!==g||r[19]!==_||r[20]!==j||r[21]!==w||r[22]!==T||r[23]!==D||r[24]!==A?(M=(0,S.jsx)(`div`,{className:`text-size-chat text-secondary`,children:(0,S.jsxs)(t,{className:w,color:`ghostTertiary`,radius:`small`,size:`inline`,"aria-expanded":T,onFocus:p,onBlur:m,onPointerEnter:h,onPointerLeave:g,onClick:_,children:[D,A,j]})}),r[15]=m,r[16]=p,r[17]=h,r[18]=g,r[19]=_,r[20]=j,r[21]=w,r[22]=T,r[23]=D,r[24]=A,r[25]=M):M=r[25];let N;r[26]===Symbol.for(`react.memo_cache_sentinel`)?(N=(0,S.jsx)(`div`,{className:`pt-1 text-size-chat text-secondary`,children:(0,S.jsx)(`div`,{className:`w-full border-t border-default`})}),r[26]=N):N=r[26];let P;return r[27]===M?P=r[28]:(P=(0,S.jsxs)(S.Fragment,{children:[M,N]}),r[27]=M,r[28]=P),P}
```

## S2 — Collapsible/persistent partition

Source: `sites-end-resource-8a7a3656de67.js`; source bytes [365737, 367269); ASAR bytes [470811000, 470812532).

```javascript
function kk(e,{hasFollowingFinalAnswer:t=!1,keepMcpAppEntriesPersistent:n=!1,mcpServerStatuses:r,renderMcpApps:i=!1}={}){let a=[],o=[],s=[],c=[],l=null,u=t?e.length:e.findLastIndex(e=>e.kind===`standalone`&&e.item.item.type===`assistant-message`&&pf(e.item.item));for(let[t,d]of e.entries()){if(d.kind===`standalone`&&d.item.item.type===`worked-for`){l=d.item.item;continue}if(d.kind===`standalone`&&d.item.item.type===`realtime-transcript`){o.length===0?c.push(d):(o.push(d),s.push(d));continue}o.push(d),Ak({unit:d,hasFollowingFinalAnswer:t<u,keepMcpAppEntriesPersistent:n,mcpServerStatuses:r,renderMcpApps:i})?s.push(d):a.push(d)}return{collapsibleUnits:a,expandedUnits:o,persistentUnits:s,preToggleUnits:c,workedForItem:l}}function Ak({unit:e,hasFollowingFinalAnswer:t,keepMcpAppEntriesPersistent:n,mcpServerStatuses:r,renderMcpApps:i}){if(e.kind!==`standalone`)return!1;let a=e.item.item;return a.type===`user-input-response`?!a.completed:a.type===`mcp-tool-call`&&lg(a)||a.type===`assistant-message`&&ki(a)||a.type===`dynamic-tool-call`&&Eg(a)||n&&i&&a.type===`mcp-tool-call`&&jk({item:a,mcpServerStatuses:r})?!0:a.type===`user-message`&&(a.steeringStatus===`pending`||a.deliveryStatus===`not-sent`||a.hookFeedback===!0||!t)}function jk({item:e,mcpServerStatuses:t}){let n=e.result?.type===`success`?e.result.raw:null;return e.completed&&e.result==null?!1:e.mcpAppResourceUri!=null||Nd({mcpServerStatuses:t,server:e.invocation.server,tool:e.invocation.tool,toolResult:n})!=null}function Mk(){return(Mk=e((()=>{Mg(),od()})))()}
```

## S3 — Eligibility, default state, count, empty-section guards

Source: `sites-end-resource-8a7a3656de67.js`; source bytes [368433, 372471); ASAR bytes [470813696, 470817734).

```javascript
function Lk({hasFinalAssistantStarted:e,isTurnCancelled:t,hasRenderableAgentItems:n,allowCollapseBeforeFinal:r=!1,forceExpanded:i=!1,preventAutoCollapse:a,persistedCollapsed:o}){return(r||e&&!t)&&n?{shouldAllowCollapse:!0,isCollapsed:!i&&(o??!a)}:{shouldAllowCollapse:!1,isCollapsed:!1}}function Rk(e){let t=(0,qk.c)(59),{units:n,deniedActionCount:r,agentActivityProps:i,visibleAgentActivityProps:a,workedDurationMs:o,workedForItem:s,hasFinalAssistantStarted:c,hasFollowingFinalAnswer:l,allowCollapseBeforeFinal:u,isTurnCancelled:d,persistedCollapsed:f,onSetCollapsed:p,forceExpanded:m,disableCollapse:h,preventAutoCollapse:g,hasInlineSubagentActivity:_,inlineSubagentActivityContent:v,keepMcpAppEntriesPersistent:y,previousTurnNumber:b,totalTurnCount:x}=e,S=r===void 0?0:r,C=o===void 0?null:o,w=s===void 0?null:s,T=l!==void 0&&l,E=u!==void 0&&u,D=m!==void 0&&m,O=h!==void 0&&h,k=g!==void 0&&g,A=_!==void 0&&_,j=v===void 0?null:v,M=y!==void 0&&y,[N,P]=(0,Jk.useState)(),F=i.mcpServerStatuses,I;if(t[0]!==E||t[1]!==O||t[2]!==D||t[3]!==c||t[4]!==A||t[5]!==N||t[6]!==d||t[7]!==f||t[8]!==k||t[9]!==n){let e=n.some(Vk);I=Lk({allowCollapseBeforeFinal:E,forceExpanded:D||O,hasFinalAssistantStarted:c||e,isTurnCancelled:d,hasRenderableAgentItems:n.length>0||A,preventAutoCollapse:k,persistedCollapsed:f??N}),t[0]=E,t[1]=O,t[2]=D,t[3]=c,t[4]=A,t[5]=N,t[6]=d,t[7]=f,t[8]=k,t[9]=n,t[10]=I}else I=t[10];let L=I,R;t[11]!==i.renderMcpApps||t[12]!==L||t[13]!==D||t[14]!==T||t[15]!==M||t[16]!==F||t[17]!==n?(R=!D&&L.shouldAllowCollapse?kk(n,{hasFollowingFinalAnswer:T,keepMcpAppEntriesPersistent:M,mcpServerStatuses:F,renderMcpApps:i.renderMcpApps}):null,t[11]=i.renderMcpApps,t[12]=L,t[13]=D,t[14]=T,t[15]=M,t[16]=F,t[17]=n,t[18]=R):R=t[18];let z=R,B=n;z!=null&&(B=L.isCollapsed?z.collapsibleUnits:z.expandedUnits);let V;t[19]!==L||t[20]!==z?(V=z!=null&&L.isCollapsed?z.persistentUnits:[],t[19]=L,t[20]=z,t[21]=V):V=t[21];let H=V,U;t[22]===z?.preToggleUnits?U=t[23]:(U=z?.preToggleUnits??[],t[22]=z?.preToggleUnits,t[23]=U);let W=U,ee=z?.collapsibleUnits??B,te=w??z?.workedForItem??null,ne=ee.reduce(Bk,0)+(j==null?0:1),G=ee.length===1&&j==null&&ee[0]?.kind===`standalone`&&ee[0].item.item.type===`context-compaction`,re=!O&&L.shouldAllowCollapse&&(B.length>0||A)&&ne>0&&!G;!re&&B.length===0&&H.length===0&&W.length===0&&(B=n);let ie=re&&L.isCollapsed,ae;t[24]!==i||t[25]!==W?(ae=W.length===0?null:(0,Yk.jsx)(ek,{...i,units:W}),t[24]=i,t[25]=W,t[26]=ae):ae=t[26];let oe=ae,se;t[27]!==i||t[28]!==H?(se=H.length===0?null:(0,Yk.jsx)(ek,{...i,units:H}),t[27]=i,t[28]=H,t[29]=se):se=t[29];let ce=se,le;t[30]!==i||t[31]!==j||t[32]!==a||t[33]!==B?(le=B.length===0&&j==null?null:(0,Yk.jsxs)(Yk.Fragment,{children:[B.length>0?(0,Yk.jsx)(ek,{...i,...a,units:B}):null,j!=null&&B.length>0?(0,Yk.jsx)(Ch,{}):null,j]}),t[30]=i,t[31]=j,t[32]=a,t[33]=B,t[34]=le):le=t[34];let ue=le;if(ue==null&&oe==null&&ce==null)return null;let de;t[35]!==oe||t[36]!==re?(de=oe!=null&&re?(0,Yk.jsx)(Ch,{}):null,t[35]=oe,t[36]=re,t[37]=de):de=t[37];let fe=p??P,pe;t[38]===ee?pe=t[39]:(pe=ee.some(zk),t[38]=ee,t[39]=pe);let me;t[40]!==ne||t[41]!==S||t[42]!==b||t[43]!==re||t[44]!==x||t[45]!==C||t[46]!==te?(me=re?{collapsedMessageCount:ne,deniedActionCount:S,workedDurationMs:C,workedForItem:te,previousTurnNumber:b,totalTurnCount:x}:null,t[40]=ne,t[41]=S,t[42]=b,t[43]=re,t[44]=x,t[45]=C,t[46]=te,t[47]=me):me=t[47];let he;t[48]!==ue||t[49]!==ie||t[50]!==ce||t[51]!==fe||t[52]!==pe||t[53]!==me?(he=(0,Yk.jsx)(Hk,{isCollapsed:ie,onSetCollapsed:fe,preloadOnInteraction:pe,toggleProps:me,persistentContent:ce,children:ue}),t[48]=ue,t[49]=ie,t[50]=ce,t[51]=fe,t[52]=pe,t[53]=me,t[54]=he):he=t[54];let ge;return t[55]!==oe||t[56]!==de||t[57]!==he?(ge=(0,Yk.jsxs)(Yk.Fragment,{children:[oe,de,he]}),t[55]=oe,t[56]=de,t[57]=he,t[58]=ge):ge=t[58],ge}function zk(e){return e.kind===`standalone`&&e.item.item.type===`dil-reasoning`}function Bk(e,t){return e+(t.kind===`group`?t.items.length:1)}function Vk(e){return e.kind===`standalone`&&e.item.item.type===`assistant-message`&&ki(e.item.item)}
```

## S4 — Toggle lifecycle, motion, inert preload, denial scroll

Source: `sites-end-resource-8a7a3656de67.js`; source bytes [372471, 376274); ASAR bytes [470817734, 470821537).

```javascript
function Hk(e){let t=(0,qk.c)(31),{isCollapsed:n,onSetCollapsed:r,preloadOnInteraction:i,toggleProps:a,persistentContent:o,children:s}=e,[c,l]=(0,Jk.useState)(!0),u=n??c,[d,f]=(0,Jk.useState)(!1),[p,m]=(0,Jk.useState)(!1),h=(0,Jk.useRef)(!1),[g,_]=(0,Jk.useState)(!1),[v,y]=(0,Jk.useState)(!1),b=(0,Jk.useRef)(null),x=(0,Jk.useRef)(0),S=kt(),C=(g||v)&&i,w;t[0]!==s||t[1]!==a?(w=s==null?null:(0,Yk.jsxs)(Yk.Fragment,{children:[a==null?null:(0,Yk.jsx)(Ch,{}),s]}),t[0]=s,t[1]=a,t[2]=w):w=t[2];let T=Gk(w),E,D;t[3]===u?(E=t[4],D=t[5]):(E=()=>{u&&(x.current+=1,h.current=!1)},D=[u],t[3]=u,t[4]=E,t[5]=D),(0,Jk.useLayoutEffect)(E,D);let O,k;t[6]===Symbol.for(`react.memo_cache_sentinel`)?(O=()=>()=>{x.current+=1,h.current=!1},k=[],t[6]=O,t[7]=k):(O=t[6],k=t[7]),(0,Jk.useLayoutEffect)(O,k);let A;t[8]!==u||t[9]!==r||t[10]!==a?(A=a==null?null:(0,Yk.jsx)(Nk,{...a,isCollapsed:u,onFocus:()=>y(!0),onBlur:()=>y(!1),onPointerEnter:()=>_(!0),onPointerLeave:()=>_(!1),onToggle:e=>{let t=!u;x.current+=1,h.current=e,m(t),f(!t),(r??l)(t)}}),t[8]=u,t[9]=r,t[10]=a,t[11]=A):A=t[11];let j;t[12]!==o||t[13]!==a?(j=a!=null&&o!=null?(0,Yk.jsx)(Ch,{}):null,t[12]=o,t[13]=a,t[14]=j):j=t[14];let M;t[15]===Symbol.for(`react.memo_cache_sentinel`)?(M=()=>m(!1),t[15]=M):M=t[15];let N;t[16]!==d||t[17]!==T||t[18]!==s||t[19]!==u||t[20]!==p||t[21]!==C||t[22]!==S?(N=(C||!u)&&s!=null?(0,Yk.jsx)(Uk,{activityRef:b,animateExpansion:d,contentStore:T,isCollapsed:u,isCollapsing:p,shouldUseReducedMotion:S,onAnimationComplete:e=>{if(e===`preloaded`&&u){m(!1);return}if(e!==`expanded`||u||(f(!1),!h.current))return;h.current=!1;let t=x.current;Dm().then(()=>{x.current===t&&b.current?.querySelector(`[data-auto-review-denied]`)?.scrollIntoView({block:`center`,behavior:S?`instant`:`smooth`})})}}):null,t[16]=d,t[17]=T,t[18]=s,t[19]=u,t[20]=p,t[21]=C,t[22]=S,t[23]=N):N=t[23];let P;t[24]===N?P=t[25]:(P=(0,Yk.jsx)(Ye,{initial:!1,onExitComplete:M,children:N}),t[24]=N,t[25]=P);let F;return t[26]!==o||t[27]!==P||t[28]!==A||t[29]!==j?(F=(0,Yk.jsxs)(Yk.Fragment,{children:[A,j,o,P]}),t[26]=o,t[27]=P,t[28]=A,t[29]=j,t[30]=F):F=t[30],F}function Uk(e){let t=(0,qk.c)(34),{activityRef:n,animateExpansion:r,contentStore:i,isCollapsed:a,isCollapsing:o,onAnimationComplete:s,shouldUseReducedMotion:c}=e,l=o||c?150/1e3:ar.duration,u=a&&!o&&`invisible`,d;t[0]===u?d=t[1]:(d=q(`-ms-2 ps-2`,u),t[0]=u,t[1]=d);let f=a||r?`hidden`:`visible`,p;t[2]===f?p=t[3]:(p={overflow:f},t[2]=f,t[3]=p);let m;t[4]!==r||t[5]!==c?(m=r?{height:c?`auto`:0,opacity:0,transform:c?`translateY(0)`:`translateY(-8px)`}:!1,t[4]=r,t[5]=c,t[6]=m):m=t[6];let h=a?`preloaded`:`expanded`,g=c&&o?`auto`:0,_=c?`translateY(0)`:`translateY(-8px)`,v;t[7]!==g||t[8]!==_?(v={height:g,opacity:0,transform:_},t[7]=g,t[8]=_,t[9]=v):v=t[9];let y;t[10]===Symbol.for(`react.memo_cache_sentinel`)?(y={height:`auto`,opacity:1,transform:`translateY(0)`},t[10]=y):y=t[10];let b;t[11]===v?b=t[12]:(b={preloaded:v,expanded:y},t[11]=v,t[12]=b);let x=c?`auto`:0,S=c?`translateY(0)`:`translateY(-8px)`,C;t[13]===Symbol.for(`react.memo_cache_sentinel`)?(C={duration:150/1e3,ease:en},t[13]=C):C=t[13];let w;t[14]!==x||t[15]!==S?(w={height:x,opacity:0,overflow:`hidden`,transform:S,transition:C},t[14]=x,t[15]=S,t[16]=w):w=t[16];let T=o||r&&!a?l:0,E=o?en:ar.ease,D;t[17]!==T||t[18]!==E?(D={...ar,duration:T,ease:E},t[17]=T,t[18]=E,t[19]=D):D=t[19];let O;t[20]===i?O=t[21]:(O=(0,Yk.jsx)(Wk,{contentStore:i}),t[20]=i,t[21]=O);let k;return t[22]!==n||t[23]!==a||t[24]!==s||t[25]!==b||t[26]!==w||t[27]!==D||t[28]!==O||t[29]!==d||t[30]!==p||t[31]!==m||t[32]!==h?(k=(0,Yk.jsx)(Rt.div,{ref:n,className:d,inert:a,style:p,initial:m,animate:h,variants:b,onAnimationComplete:s,exit:w,transition:D,children:O}),t[22]=n,t[23]=a,t[24]=s,t[25]=b,t[26]=w,t[27]=D,t[28]=O,t[29]=d,t[30]=p,t[31]=m,t[32]=h,t[33]=k):k=t[33],k}
```

## S5 — Initial prompts, activity, blocking requests, final item split

Source: `split-items-into-render-groups-cc782c6c04ea.js`; source bytes [317, 7023); ASAR bytes [484384605, 484391311).

```javascript
function p(e,t,n,r,a){let o=null,s=null,l=[],u=null,p=null,y=null,C=null,E=[],D=[],O=new Set,k=[],A=[],j=[],M=[],N=[],P=[],F=[],I=[],L=[],R=[],z=[],B=!1,V=!1,H=null,U=new Set,W=new Set,G=null;for(let r of e){let e=r.type===`subagent-activity`&&!r.isMessage,i=e&&!V;if(V=e,r.type===`user-message`&&r.heartbeatTrigger!=null){l.push(r);continue}if(!B&&r.type===`user-message`){l.push(r);continue}if(B||=r.type!==`worktree-init`,n===`latest`){if(r.type===`dynamic-tool-call`&&ne(r.namespace,r.tool)&&r.completed&&r.success===!0){let e=ee(r.arguments);e!==void 0&&(G=e==null?null:{type:`up-next-status`,content:e},H=null)}if(r.type===`assistant-message`){let e=r.content.trim().length>0||r.isSkippedCompletion===!0||r.structuredOutput!=null;if(r.phase===`commentary`&&r.delivery!==`async`&&r.requestUserInputAsync==null){k.push(r),U.add(r),(!r.completed||e)&&(H=r);continue}(r.delivery===`async`||r.requestUserInputAsync!=null||r.phase===`final_answer`&&e)&&(H=null)}else(r.type===`user-message`&&r.deliveryStatus!==`not-sent`&&r.hookFeedback!==!0&&r.heartbeatTrigger==null&&r.codexDelegation==null||r.type===`realtime-transcript`&&r.entries.some(({role:e})=>e===`user`))&&(G=null,H=null)}if(r.type===`turn-diff`&&(u=r),r.type===`todo-list`&&(p=r),r.type===`proposed-plan`){y=r;continue}if(r.type===`remote-task-created`&&P.push(r),r.type===`personality-changed`&&F.push(r),r.type===`forked-from-conversation`&&I.push(r),r.type===`model-changed`){L.push(r);continue}if(r.type===`model-rerouted`){R.push(r);continue}if(r.type===`plan-implementation`){C=r;continue}if(r.type===`mcp-server-elicitation`){if(r.completed===!0){r.elicitation.kind!==`unsupportedOpenAIForm`&&k.push(r);continue}let e=w(r);e!=null&&O.add(e),E.push(r);continue}if(r.type===`permission-request`){D.push(r);continue}let c=re(r),d=!c&&v(r);if(c||d){o=r;continue}if(r.type===`userInput`&&r.completed!==!0){s=r;continue}if(r.type===`user-message`){k.push(r);continue}if(r.type===`generated-image`){let e=b(r);e||M.push(r),(t===`in_progress`||e)&&k.push(r);continue}if(a!=null&&r.type===`mcp-tool-call`){let e=te(r,a);if(e?.type===`chatgpt-automation`){j.push({callId:r.callId,automation:e});continue}}if(r.type===`automation-update`){A.push(r);continue}if(r.type===`auto-review-interruption-warning`){N.push(r);continue}if(r.type===`subagent-activity`){r.isMessage?k.push(r):i?(k.push(r),z.push([r])):z.at(-1)?.push(r);continue}(r.type===`reasoning`||r.type===`automatic-approval-review`||f(r)!=null)&&k.push(r)}let K=S(k),q=n===`latest`?[]:x(K),J=!1,Y=n===`latest`||O.size>0?K.filter((e,t)=>U.has(e)?(J=!0,e===H):e.type===`mcp-tool-call`&&!e.completed&&O.has(e.invocation.server)?!1:(J&&f(e)?.grouping===`groupable`&&!d(e,K[t+1])&&(W.add(e),J=!1),!0)):K;n===`latest`&&q.push(...x(Y));let X=Y.length-1;for(;Y[X]?.type===`mcp-server-elicitation`;)--X;if(!m(Y[X],r)){let e=X;for(;;){let n=Y[e];if(n?.type!==`mcp-server-elicitation`&&n?.type!==`subagent-activity`&&(n?.type!==`user-message`||n.steeringStatus!==`accepted`||n.codexDelegation==null)&&!b(n)&&(n?.type!==`reasoning`||!n.completed)&&(n?.type!==`exec`||t!==`complete`||!n.parsedCmd.isFinished)&&(n?.type!==`dynamic-tool-call`||t!==`complete`||!n.completed))break;--e}let n=Y[e];m(n,r)&&n.phase===`final_answer`&&(X=e)}let Z=Y[X],Q=m(Z,r)?Z:null,ie=(Q?.content?.trim().length??0)>0||Q?.isSkippedCompletion===!0||!!Q?.structuredOutput;if(Q){for(let e of Y.splice(X+1))e.type===`user-message`?N.push(e):Y.push(e);Y.splice(X,1);let e=Y[X-1];Q.phase===`final_answer`&&e?.type===`assistant-message`&&e.phase===`final_answer`&&e.searchItemId!=null&&e.searchItemId===Q.searchItemId&&(0,h.default)(e,Q)&&Y.splice(X-1,1),N.push(...q)}else Y.push(...q);if(N.length>1){let t=new Set(N);N=e.filter(e=>t.has(e))}let ae=Y[Y.length-1],oe=t!==`in_progress`&&!ie&&T(ae)?ae:null;oe&&Y.pop();let $=(0,g.default)([...A].reverse(),e=>e.result?.automationId??e.arguments.id??e.callId).reverse(),se=Q!=null&&Q.completed&&$.length>0?{...Q,automationCitations:$}:Q;return{userItems:l,agentItems:Y,toolGroupStartItems:W,upNextStatusItem:n===`latest`&&t===`in_progress`?G:null,automationUpdateItems:Q==null?$:[],cloudAutomationItems:j,assistantItem:se,currentCommentaryItem:H===Q?se:H,toolOutputItems:M,postAssistantItems:N,systemEventItem:oe,unifiedDiffItem:u,remoteTaskCreatedItems:P,personalityChangedItems:F,forkedFromConversationItems:I,modelChangedItems:L,modelReroutedItems:R,subagentActivityItemGroups:z,todoListItem:p,proposedPlanItem:y,planImplementationItem:C,mcpServerElicitationItems:(0,_.default)(E,(e,t)=>c(e.elicitation)&&c(t.elicitation)&&e.requestId===t.requestId||e.elicitation.kind===`connectorAuth`&&t.elicitation.kind===`connectorAuth`&&i(e.elicitation.connector,t.elicitation.connector)),permissionRequestItems:D,approvalItem:o,userInputItem:s}}function m(e,t){return y(e)&&e.delivery!==`async`&&e.requestUserInputAsync==null&&t?.(e)!==!0}var h,g,_,re,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{h=t(n(),1),g=t(r(),1),_=t(s(),1),l(),o(),a(),u(),re=e=>e.type===`patch`&&e.approvalRequestId!=null&&e.success==null,v=e=>e.type===`exec`&&e.approvalRequestId!=null&&e.output?.exitCode===void 0,y=e=>e?.type===`assistant-message`,b=e=>e?.type===`generated-image`&&e.failure?.type===`usageLimitExceeded`&&e.failure.limitId===`image_gen`,x=e=>{let t=[];for(;;){let n=e[e.length-1];if(n?.type!==`automatic-approval-review`)break;e.pop(),t.push(n)}return t.reverse()},S=e=>{let t=new Map,n=new Set,r=new Map;for(let t of e){if(t.type!==`exec`&&t.type!==`patch`&&t.type!==`mcp-tool-call`)continue;let e=C(t);e!=null&&r.set(e,t.type)}for(let i of e){let e=i.type===`automatic-approval-review`&&i.targetItemId!=null?r.get(i.targetItemId):void 0;if(i.type===`automatic-approval-review`&&i.targetItemId!=null&&e!=null&&(i.status!==`denied`||e!==`mcp-tool-call`)){n.add(i.id);let e=t.get(i.targetItemId);if(e==null){t.set(i.targetItemId,[i]);continue}e.push(i)}}return e.flatMap(e=>{if(e.type===`automatic-approval-review`&&n.has(e.id))return[];let r=C(e),i=r==null?null:t.get(r)??null;return i==null?[e]:[{...e,automaticApprovalReviews:i}]})},C=e=>e.type===`exec`||e.type===`patch`||e.type===`mcp-tool-call`?e.type===`exec`?e.commandExecutionItemId??e.callId:e.callId:null,w=e=>{switch(e.elicitation.kind){case`userVerification`:case`browserAuth`:case`formElicitation`:case`openaiForm`:case`legacyOpenAIForm`:case`generic`:case`urlAction`:return e.elicitation.serverName.trim()||null;case`mcpToolCall`:return e.elicitation.approval.connector_id;case`connectorAuth`:return e.elicitation.connector.connector_id;case`toolSuggestion`:case`unsupportedOpenAIForm`:return null}},T=e=>e?.type===`system-error`})))()}export{p as n,E as t};
//# sourceMappingURL=split-items-into-render-groups-cc782c6c04ea.js.map
```

## S6 — Structured work status labels and clock

Source: `app-primary-b4ce9e46e8cf.js`; source bytes [842337, 846109); ASAR bytes [71558858, 71562630).

```javascript
function SG(e){let t=(0,CG.c)(20),{status:n,startedAtMs:r,completedAtMs:i,className:a}=e,o;t[0]!==i||t[1]!==r||t[2]!==n?(o={status:n,startedAtMs:r,completedAtMs:i},t[0]=i,t[1]=r,t[2]=n,t[3]=o):o=t[3];let{timeLabel:s,elapsedMs:c}=F7e(o),l;bb0:switch(n){case`loading`:{let e;t[4]===Symbol.for(`react.memo_cache_sentinel`)?(e=(0,wG.jsx)(Ade,{as:`span`,className:`w-36`,size:`md`}),t[4]=e):e=t[4];let n;t[5]===Symbol.for(`react.memo_cache_sentinel`)?(n=(0,wG.jsxs)(`span`,{className:`flex h-lh items-center`,children:[e,(0,wG.jsx)(`span`,{className:`sr-only`,children:(0,wG.jsx)(J,{id:`localConversation.loadingWorkStatus`,defaultMessage:`Loading activity status`,description:`Accessible label for the placeholder shown while synchronizing a saved turn's running state`})})]}),t[5]=n):n=t[5],l=n;break bb0}case`unknown`:{let e;t[6]===Symbol.for(`react.memo_cache_sentinel`)?(e=(0,wG.jsx)(J,{id:`localConversation.workActivity`,defaultMessage:`Activity`,description:`Heading for saved assistant activity when its running state and elapsed work time are unavailable`}),t[6]=e):e=t[6],l=e;break bb0}case`paused`:{let e;t[7]===Symbol.for(`react.memo_cache_sentinel`)?(e=(0,wG.jsx)(J,{id:`localConversation.paused`,defaultMessage:`Paused`,description:`Work task paused after reaching its usage limit`}),t[7]=e):e=t[7],l=e;break bb0}case`working`:{let e;t[8]!==c||t[9]!==s?(e=c>=1e3?(0,wG.jsx)(J,{...bte.workingFor,values:{time:s}}):(0,wG.jsx)(J,{id:`localConversation.working`,defaultMessage:`Working`,description:`Divider shown while the assistant has started working but has not yet crossed the elapsed-time threshold`}),t[8]=c,t[9]=s,t[10]=e):e=t[10],l=e;break bb0}case`worked`:{let e;t[11]===s?e=t[12]:(e=(0,wG.jsx)(J,{id:`localConversation.workedFor.v2`,defaultMessage:`Worked for {time}`,description:`Divider shown between agent activity and the final assistant response in a completed turn. 'For' indicates elapsed duration, so translate this as a natural duration phrase.`,values:{time:s}}),t[11]=s,t[12]=e),l=e;break bb0}case`stopped`:{let e;t[13]===s?e=t[14]:(e=(0,wG.jsx)(J,{id:`localConversation.userStoppedAfter`,defaultMessage:`You stopped after {time}`,description:`Divider label shown when the user interrupts a turn, including elapsed time`,values:{time:s}}),t[13]=s,t[14]=e),l=e}}let u=a??`text-tertiary`,d;t[15]===u?d=t[16]:(d=zs(`tabular-nums`,u),t[15]=u,t[16]=d);let f;return t[17]!==l||t[18]!==d?(f=(0,wG.jsx)(`span`,{className:d,children:l}),t[17]=l,t[18]=d,t[19]=f):f=t[19],f}function P7e(e){let t=(0,CG.c)(13),{leadingAccessory:n,status:r,startedAtMs:i,completedAtMs:a}=e,o;t[0]!==a||t[1]!==i||t[2]!==r?(o=(0,wG.jsx)(SG,{status:r,startedAtMs:i,completedAtMs:a}),t[0]=a,t[1]=i,t[2]=r,t[3]=o):o=t[3];let s=o,c=n==null&&`overflow-hidden`,l;t[4]===c?l=t[5]:(l=zs(`flex min-h-0 flex-col items-start gap-2 text-size-chat text-secondary`,c),t[4]=c,t[5]=l);let u;t[6]!==s||t[7]!==n?(u=n==null?s:(0,wG.jsxs)(`div`,{className:`flex items-start gap-2`,children:[n,s]}),t[6]=s,t[7]=n,t[8]=u):u=t[8];let d;t[9]===Symbol.for(`react.memo_cache_sentinel`)?(d=(0,wG.jsx)(`div`,{className:`w-full border-t border-default`}),t[9]=d):d=t[9];let f;return t[10]!==l||t[11]!==u?(f=(0,wG.jsx)(ty,{padding:`offset`,children:(0,wG.jsxs)(`div`,{className:l,children:[u,d]})}),t[10]=l,t[11]=u,t[12]=f):f=t[12],f}function F7e(e){let t=(0,CG.c)(7),{status:n,startedAtMs:r,completedAtMs:i}=e,a=ra(),[o,s]=(0,L7e.useState)(I7e),c;t[0]===Symbol.for(`react.memo_cache_sentinel`)?(c=()=>{s(Date.now())},t[0]=c):c=t[0],O_(c,n===`working`&&i==null?1e3:null);let l=Math.max((i??o)-r,0),u;t[1]!==l||t[2]!==a.locale?(u=Wfe(l,a.locale),t[1]=l,t[2]=a.locale,t[3]=u):u=t[3];let d;return t[4]!==l||t[5]!==u?(d={timeLabel:u,elapsedMs:l},t[4]=l,t[5]=u,t[6]=d):d=t[6],d}function I7e(){return Date.now()}
```

## S7 — Whole-second localized duration formatting

Source: `app-initial-90eb42395b7d.js`; source bytes [13284901, 13285846); ASAR bytes [69255662, 69256607).

```javascript
function WJu(e,{locale:t=`en`,underOneSecond:n=`null`,trimZeroUnits:r=!1}={}){let i=Math.floor(Math.max(e,0)/1e3);if(i<1)return n===`zero`?_7(0,`second`,t):null;if(i<60)return _7(i,`second`,t);let a=3600,o=Math.floor(i/(a*24)),s=Math.floor(i/a)%24,c=Math.floor(i%a/60),l=i%60;if(o>0||s>0){let e=[];return o>0&&e.push(_7(o,`day`,t)),(s>0||!r)&&e.push(_7(s,`hour`,t)),(c>0||!r)&&e.push(_7(c,`minute`,t)),(l>0||!r)&&e.push(_7(l,`second`,t)),e.join(` `)}return r&&l===0?_7(c,`minute`,t):[_7(c,`minute`,t),_7(l,`second`,t)].join(` `)}function _7(e,t,n){let r=`${n}:${t}`,i=GJu.get(r);return i??(i=new Intl.NumberFormat(n,{style:`unit`,unit:t,unitDisplay:`narrow`}),GJu.set(r,i)),n.toLowerCase().split(`-`)[0]===`hu`?i.formatToParts(e).filter(e=>e.type!==`literal`).map(e=>e.value).join(``):i.format(e)}var GJu;function KJu(){return(KJu=t((()=>{GJu=new Map})))()}function qJu(e,t){return WJu(e,{locale:t,underOneSecond:`zero`,trimZeroUnits:!0})??`0s`}
```

## S8 — Qualifying final assistant predicate

Source: `app-initial-90eb42395b7d.js`; source bytes [3503169, 3503485); ASAR bytes [59473930, 59474246).

```javascript
function F$n(e){return e!=null&&(e.content.trim().length>0||e.completed||e.structuredOutput!=null)}function I$n(e){return e?.phase===`final_answer`&&e.delivery!==`async`&&e.requestUserInputAsync==null&&F$n(e)}function L$n(e){return e!=null&&e.completed&&I$n(e)&&(e.content.trim().length>0||e.structuredOutput!=null)}
```

## S9 — Structured work item generation

Source: `app-initial-90eb42395b7d.js`; source bytes [3527670, 3528085); ASAR bytes [59498431, 59498846).

```javascript
function K1n({status:e,hasStartedWork:t,workStartedAtMs:n,workedCompletedAtMs:r}){return!t||n==null?null:e===`cancelled`?{type:`worked-for`,status:`unknown`,startedAtMs:n,completedAtMs:null}:r==null?e===`in_progress`?{type:`worked-for`,status:`working`,startedAtMs:n,completedAtMs:null}:null:{type:`worked-for`,status:`worked`,startedAtMs:n,completedAtMs:r}}function q1n(e){return e.items.some(e=>e.type===`sleep`)}
```

## S10 — Work timing inputs

Source: `app-initial-90eb42395b7d.js`; source bytes [3577522, 3577936); ASAR bytes [59548283, 59548697).

```javascript
let oe=omn(y.status),se=r4n({items:w,status:oe,workStartedAtMs:q1n(y)||oe===`complete`&&y.firstTurnWorkItemStartedAtMs==null?null:y.turnStartedAtMs??y.firstTurnWorkItemStartedAtMs??null,finalAssistantStartedAtMs:y.finalAssistantStartedAtMs??null});return{items:o?hhn(se):se,hookRuns:y.hookRuns,status:oe,cwd:y.params?.cwd?$c(y.params.cwd):null,collaborationMode:y.params?.collaborationMode??null,artifacts:yZn(T)}}
```

## S11 — Duration endpoint and work-start eligibility

Source: `app-initial-90eb42395b7d.js`; source bytes [3581673, 3582812); ASAR bytes [59552434, 59553573).

```javascript
function r4n({items:e,status:t,workStartedAtMs:n,finalAssistantStartedAtMs:r}){let i=i4n(e,t);if(i<0)return e;let a=K1n({status:t,hasStartedWork:o4n(e,i),workStartedAtMs:n,workedCompletedAtMs:c4n({items:e,status:t,finalAssistantStartedAtMs:r})});if(a==null)return e;let o=t===`complete`?i:a4n(e);return[...e.slice(0,o),a,...e.slice(o)]}function i4n(e,t){if(t===`in_progress`){for(let[t,n]of e.entries())if(n.type===`assistant-message`&&n.phase===`final_answer`&&n.delivery!==`async`&&n.requestUserInputAsync==null)return t;return e.length}if(t===`cancelled`)return e.length;for(let t=e.length-1;t>=0;--t)if(e[t]?.type===`assistant-message`)return t;return-1}function a4n(e){for(let[t,n]of e.entries())if(!s4n(n))return t;return e.length}function o4n(e,t){for(let n=0;n<t;n+=1)if(!s4n(e[n]))return!0;return!1}function s4n(e){return e==null||e.type===`user-message`||e.type===`external-event`||e.type===`realtime-transcript`||e.type===`worktree-init`}function c4n({items:e,status:t,finalAssistantStartedAtMs:n}){if(t!==`in_progress`)return n;if(n==null)return null;for(let t of e)if(t.type===`assistant-message`&&I$n(t))return n;return null}
```

## S12 — Turn-level disclosure route and exceptions

Source: `local-conversation-turn-918111aed944.js`; source bytes [76453, 77534); ASAR bytes [296786347, 296787428).

```javascript
if(Qi){let e=Wa(Ma,{includeGeneratedImages:!0,mcpServerStatuses:ji,groupStartItems:sn}),t=n===`latest`?Ga(e,Gi):e;X(`agent-activity`,n===`all`?(0,$.jsx)(za,{hasFollowingFinalAnswer:Ir(Y),allowCollapseBeforeFinal:Bt,units:t,deniedActionCount:Xr,agentActivityProps:to,visibleAgentActivityProps:no,workedDurationMs:at?null:Ce,workedForItem:Xi,hasFinalAssistantStarted:ti||!K&&ar,isTurnCancelled:!Ze&&Ke,persistedCollapsed:ae,onSetCollapsed:N,forceExpanded:Be||!Bt&&rt!==`off`&&(U||ne!=null&&re!=null&&ne>=re-1),disableCollapse:l!=null||Be||Ne,preventAutoCollapse:Bt&&K||nt||or,hasInlineSubagentActivity:ar,inlineSubagentActivityContent:rr,keepMcpAppEntriesPersistent:Ae,previousTurnNumber:ne,totalTurnCount:re}):(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(ga,{...to,...no,units:t}),rr!=null&&t.length>0?(0,$.jsx)(Hi,{}):null,rr]}),{canOwnLatestTurnFollowContent:!1})}else n===`all`&&a!=null&&X(`agent-activity-summary`,(0,$.jsx)(Ct,{padding:`offset`,children:(0,$.jsx)(ei,{status:a.status,startedAtMs:a.startedAtMs,completedAtMs:a.completedAtMs})}),{canOwnLatestTurnFollowContent:!1});
```

## S13 — Latest-mode visible activity filtering

Source: `inline-followup-markdown-8cb3de7e61c6.js`; source bytes [19949, 20138); ASAR bytes [258582404, 258582593).

```javascript
function qe(e,t){let n=e.findLastIndex(e=>e.kind!==`standalone`||e.item.item.type!==`assistant-message`||f(e.item.item));return e.filter((e,r)=>e.kind!==`group`||t&&r===n||e.items.some(Q))}
```

## S14 — Dynamic-tool persistence opt-in

Source: `agent-activity-item-52caeab690d6.js`; source bytes [19880, 19947); ASAR bytes [46150328, 46150395).

```javascript
function or(e){return Q(e)?.persistentInCollapsedConversation===!0}
```

## S15 — Specific MCP approval-policy error persistence

Source: `mcp-tool-call-approval-e50f8e2c4339.js`; source bytes [1792, 1920); ASAR bytes [312503907, 312504035).

```javascript
function x(e){return e.result?.type===`error`&&e.result.error===`MCP tool call requires approval, but approval policy is never`}
```

## S16 — Interrupted-by-client duration compatibility branch

Source: `local-conversation-turn-918111aed944.js`; source bytes [59558, 59703); ASAR bytes [296769452, 296769597).

```javascript
let _t=G(Un,u),yt=G(Ar,u),bt=!Ze&&!at&&b?.status===`interrupted`&&we?{type:`worked-for`,status:`stopped`,startedAtMs:0,completedAtMs:Ce??0}:null,
```

## S17 — Running, cancelled and structured-terminal flag definitions

Source: `local-conversation-turn-918111aed944.js`; source bytes [58366, 58636); ASAR bytes [296768260, 296768530).

```javascript
let Ge=G(qn,We),K=Ge==null?x.status===`in_progress`:Ge===`inProgress`,Ke=x.status===`cancelled`,Je;t[5]===b?Je=t[6]:(Je=()=>b==null?void 0:zi(b.params.input,b.items),t[5]=b,t[6]=Je);let Xe=Ee(Je),Ze=l===`terminal`||a!=null,$e=b?.safetyBuffering?.showBufferingUi===!0&&K,
```

## S18 — Activity-context early-collapse flag

Source: `local-conversation-turn-918111aed944.js`; source bytes [60526, 60595); ASAR bytes [296770420, 296770489).

```javascript
Bt=(0,ml.useContext)(oi)===`activity`,Vt=Ot?x.transcriptItems:void 0;
```

## S19 — Disclosure click identifies denial badge

Source: `sites-end-resource-8a7a3656de67.js`; source bytes [367269, 368342); ASAR bytes [470812532, 470813605).

```javascript
function Nk(e){let t=(0,Pk.c)(20),{label:n,collapsedMessageCount:r,deniedActionCount:i,workedDurationMs:a,workedForItem:o,isCollapsed:s,previousTurnNumber:c,totalTurnCount:l,onFocus:u,onBlur:d,onPointerEnter:f,onPointerLeave:p,onToggle:m}=e,h=pt(el),g=rt(),_;t[0]!==i||t[1]!==s||t[2]!==m||t[3]!==c||t[4]!==h||t[5]!==l||t[6]!==g?(_=e=>{let t=s&&i>0&&e.target instanceof Element&&e.target.closest(`[data-denied-action-count]`)!=null;t||Bp(e.currentTarget,g),s&&c!=null&&l!=null&&h.logProductEvent(Ln,{target:nr.CODEX_PREVIOUS_TURN_EXPANDED_TARGET_TURN,turnNumber:c,totalTurnCount:l}),m(t)},t[0]=i,t[1]=s,t[2]=m,t[3]=c,t[4]=h,t[5]=l,t[6]=g,t[7]=_):_=t[7];let v;return t[8]!==r||t[9]!==i||t[10]!==s||t[11]!==n||t[12]!==d||t[13]!==u||t[14]!==f||t[15]!==p||t[16]!==_||t[17]!==a||t[18]!==o?(v=(0,Fk.jsx)(D_,{label:n,collapsedMessageCount:r,deniedActionCount:i,workedDurationMs:a,workedForItem:o,isCollapsed:s,onFocus:u,onBlur:d,onPointerEnter:f,onPointerLeave:p,onToggle:_}),t[8]=r,t[9]=i,t[10]=s,t[11]=n,t[12]=d,t[13]=u,t[14]=f,t[15]=p,t[16]=_,t[17]=a,t[18]=o,t[19]=v):v=t[19],v}
```

## S20 — Formatter imported local binding

Source: `app-primary-b4ce9e46e8cf.js`; source bytes [49542, 49552); ASAR bytes [70766063, 70766073).

```javascript
Rp as Wfe,
```

## S21 — Formatter exported binding

Source: `app-initial-90eb42395b7d.js`; source bytes [14313796, 14313806); ASAR bytes [70284557, 70284567).

```javascript
qJu as Rp,
```

## S22 — Formatter import declaration module source

Source: `app-primary-b4ce9e46e8cf.js`; source bytes [71457, 71545); ASAR bytes [70787978, 70788066).

```javascript
zrt as fBe,zs as pBe,zu as mBe,zun as fj,zxr as hBe}from"./app-initial-90eb42395b7d.js";
```
