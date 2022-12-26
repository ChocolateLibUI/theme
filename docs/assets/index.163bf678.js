var X=Object.defineProperty;var Y=(i,e,t)=>e in i?X(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var o=(i,e,t)=>(Y(i,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const V="@chocolatelibui/theme",Z="modulepreload",ee=function(i,e){return new URL(i,e).href},M={},y=function(e,t,s){if(!t||t.length===0)return e();const n=document.getElementsByTagName("link");return Promise.all(t.map(r=>{if(r=ee(r,s),r in M)return;M[r]=!0;const a=r.endsWith(".css"),c=a?'[rel="stylesheet"]':"";if(!!s)for(let l=n.length-1;l>=0;l--){const m=n[l];if(m.href===r&&(!a||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${r}"]${c}`))return;const h=document.createElement("link");if(h.rel=a?"stylesheet":Z,a||(h.as="script",h.crossOrigin=""),h.href=r,document.head.appendChild(h),a)return new Promise((l,m)=>{h.addEventListener("load",l),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${r}`)))})})).then(()=>e())};let _=[],te=async i=>{_.includes(i)?console.warn("Document registered with theme engine twice"):(_.push(i),(await y(()=>Promise.resolve().then(()=>C),void 0,import.meta.url)).applyTheme(i,await(await y(()=>Promise.resolve().then(()=>C),void 0,import.meta.url)).theme.get),(await y(()=>Promise.resolve().then(()=>oe),void 0,import.meta.url)).initTouch(i),(await y(()=>Promise.resolve().then(()=>_e),void 0,import.meta.url)).initScale(i))};te(document);let N=(i,e)=>{var s;let t=new TextEncoder().encode(i);return i=new TextDecoder().decode(t.slice(0,e)),((s=i.at(-1))==null?void 0:s.charCodeAt(0))===65533?i.slice(0,-1):i};class b{constructor(e){o(this,"___valueListeners",[]);o(this,"___value");o(this,"info");this.___value=e}addListener(e,t){if(this.___valueListeners.push(e),t){let s=this.get;s instanceof Promise?s.then(e):e(s)}return e}removeListener(e){let t=this.___valueListeners.indexOf(e);return t!=-1&&this.___valueListeners.splice(t,1),e}get get(){return this.___value}set set(e){this.___value!==e&&(this.___value=e,this.___update())}___update(){if(this.___valueListeners)for(let e=0,t=this.___valueListeners.length;e<t;e++)try{this.___valueListeners[e](this.___value)}catch(s){console.warn("Failed while calling value listeners ",s)}}compare(e){let t=this.get;return t instanceof Promise?t.then(s=>e!==s):e!==t}get inUse(){return this.___valueListeners.length!==0}hasListener(e){return this.___valueListeners.indexOf(e)!==-1}toJSON(){return this.___value}}class G extends b{constructor(t,s){super(t);o(this,"___limiters");o(this,"___limitersListeners",[]);this.___limiters=s}addLimiterListener(t,s){return this.___limitersListeners.push(t),s&&t(this),t}removeLimiterListener(t){let s=this.___limitersListeners.indexOf(t);return s!=-1&&this.___limitersListeners.splice(s,1),t}___updateLimiter(){if(this.___limitersListeners)for(let t=0,s=this.___limitersListeners.length;t<s;t++)try{this.___limitersListeners[t](this)}catch(n){console.warn("Failed while calling value listeners ",n)}}get limiters(){return this.___limiters}set limiters(t){t?this.___limiters=t:delete this.___limiters,this.___updateLimiter()}checkLimit(t){if(this.___limiters){for(let s=0;s<this.___limiters.length;s++)if(this.___limiters[s].func(t))return!1}return!0}checkLimitReason(t){if(this.___limiters){for(let s=0;s<this.___limiters.length;s++)if(this.___limiters[s].func(t))switch(typeof this.___limiters[s].reason){case"string":return this.___limiters[s].reason;case"function":return this.___limiters[s].reason(t)}}return!0}set set(t){t===this.___value||!this.checkLimit(t)||(this.___value=t,this.___update())}}class k extends G{constructor(t,s=-1/0,n=1/0,r,a){super(t,a);o(this,"_min");o(this,"_max");o(this,"_step");o(this,"halfStep",0);this._min=s,this._max=n,r&&(this._step=r,this.halfStep=r/2)}get min(){return this._min}set min(t){this._min=t;let s=Math.max(this._min,this.___value);this.___value!==s&&(this.___value=s,this.___update()),this.___updateLimiter()}get max(){return this._max}set max(t){this._max=t;let s=Math.min(this._max,this.___value);this.___value!==s&&(this.___value=s,this.___update()),this.___updateLimiter()}get step(){return this._step}set step(t){if(t){this._step=t,this.halfStep=t/2;let s=this.___value%this._step,n=s>this.halfStep?this.___value+(this._step-s):this.___value-s;n!==this.___value&&(this.___value=n,this.___update())}else delete this._step,this.halfStep=0;this.___updateLimiter()}set set(t){if(this._step){let s=t%this._step;t=s>this.halfStep?t+(this._step-s):t-s}t=Math.min(this._max,Math.max(this._min,t)),t!==this.___value&&this.checkLimit(t)&&(this.___value=t,this.___update())}}class x extends G{constructor(t,s,n,r,a){super(t,a);o(this,"_maxLength");o(this,"_maxByteLength");o(this,"___enums");this._maxLength=n,this._maxByteLength=r,this.___enums=s}get enums(){return this.___enums}set enums(t){if(t){if(this.___enums=t,!this.checkEnum(this.___value))for(const s in this.___enums){this.___value=s,this.___update();return}}else delete this.___enums;this.___updateLimiter()}get enum(){if(this.___enums)return this.___enums[this.___value]}checkEnum(t){return!this.___enums||t in this.___enums}get maxLength(){return this._maxLength}set maxLength(t){this._maxLength=t,this._maxLength&&this.___value.length>this._maxLength&&(this.___value=this.___value.slice(0,this._maxLength),this.___update()),this.___updateLimiter()}get maxByteLength(){return this._maxByteLength}set maxByteLength(t){if(this._maxByteLength=t,this._maxByteLength){let s=N(this.___value,this._maxByteLength);this.___value!==s&&(this.___value=s,this.___update())}this.___updateLimiter()}set set(t){this._maxLength&&t.length>this._maxLength&&(t=t.slice(0,this._maxLength)),this._maxByteLength&&(t=N(t,this._maxByteLength)),t!==this.___value&&this.checkLimit(t)&&this.checkEnum(t)&&(this.___value=t,this.___update())}}var ie=Object.defineProperty,se=(i,e,t)=>e in i?ie(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,L=(i,e,t)=>(se(i,typeof e!="symbol"?e+"":e,t),t);let B={},ne=(i,e,t)=>(B[i]=new I(i,e,t),B[i]);class I{constructor(e,t,s){L(this,"pathID"),L(this,"settings",{}),L(this,"subGroups",{}),L(this,"name"),L(this,"description"),this.pathID=e,this.name=t,this.description=s}makeSubGroup(e,t,s){if(e in this.subGroups){console.warn("Sub group already registered "+e);return}else return this.subGroups[e]=new I(this.pathID+"/"+e,t,s)}makeBooleanSetting(e,t,s,n){if(e in this.settings)throw new Error("Settings already registered "+e);let r=localStorage[this.pathID+"/"+e];if(r)var a=new b(JSON.parse(r));else if(typeof n=="boolean")var a=new b(n);else{var a=new b(!1);n.then(u=>{a.set=u})}return a.info={name:t,description:s},a.addListener(c=>{localStorage[this.pathID+"/"+e]=JSON.stringify(c)},!r),this.settings[e]=a}makeNumberSetting(e,t,s,n,r,a,c,u){if(e in this.settings)throw new Error("Settings already registered "+e);let h=localStorage[this.pathID+"/"+e];if(h)var l=new k(JSON.parse(h),r,a,c,u);else if(typeof n=="number")var l=new k(n,r,a,c,u);else{var l=new k(NaN,r,a,c,u);n.then(T=>{l.set=T})}return l.info={name:t,description:s},l.addListener(m=>{localStorage[this.pathID+"/"+e]=JSON.stringify(m)},!h),this.settings[e]=l}makeStringSetting(e,t,s,n,r,a,c,u){if(e in this.settings)throw new Error("Settings already registered "+e);let h=localStorage[this.pathID+"/"+e];if(h)var l=new x(JSON.parse(h),r,a,c,u);else if(typeof n=="string")var l=new x(n,r,a,c,u);else{var l=new x("",r,a,c,u);n.then(T=>{l.set=T})}return l.info={name:t,description:s},l.addListener(m=>{localStorage[this.pathID+"/"+e]=JSON.stringify(m)},!h),this.settings[e]=l}}let v=ne(V,"Theme/UI","Settings for UI elements and and color themes"),w={},re={light:{name:"Light",description:"Don't set touch mode automatically"},dark:{name:"Dark",description:"Change touch mode on first ui interaction"}},p=v.makeStringSetting("theme","Theme","Color theme of UI",window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",re),S=v.makeBooleanSetting("autoTheme","Automatic Theme Change","Toggle for automatically changing theme",!0),R=(i,e,t)=>(w[i]=new E(i,e,t),w[i]);class E{constructor(e,t,s){o(this,"pathID");o(this,"variables",{});o(this,"subGroups",{});o(this,"name");o(this,"description");this.pathID=e,this.name=t,this.description=s}makeSubGroup(e,t,s){if(e in this.subGroups){console.warn("Sub group already registered "+e);return}else return this.subGroups[e]=new E(this.pathID+"/"+e,t,s)}makeVariable(e,t,s,n,r,a,c){if(e in this.variables)throw new Error("Settings already registered "+e);let u="--"+this.pathID+"/"+e,h=this.variables[u]={name:t,desc:s,vars:{light:n,dark:r}};for(let l=0;l<_.length;l++)_[l].documentElement.style.setProperty(u,h.vars[p.get])}applyThemes(e,t){for(const s in this.variables)e.setProperty(s,this.variables[s].vars[t]);for(const s in this.subGroups)this.subGroups[s].applyThemes(e,t)}}let U=(i,e)=>{for(const t in w)w[t].applyThemes(i.documentElement.style,e)};p.addListener(i=>{for(let e=0;e<_.length;e++)U(_[e],i)});window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",i=>{S.get&&(p.set=i.matches?"dark":"light")});const C=Object.freeze(Object.defineProperty({__proto__:null,theme:p,autoTheme:S,initVariableRoot:R,VariableGroup:E,applyTheme:U},Symbol.toStringTag,{value:"Module"}));var A=(i=>(i.Off="off",i.First="first",i.Every="every",i))(A||{});let ae={off:{name:"Off",description:"Don't set touch mode automatically"},first:{name:"First Interaction",description:"Change touch mode on first ui interaction"},every:{name:"Every Interaction",description:"Change touch mode on every ui interaction"}},d=v.makeBooleanSetting("touch","Touch Mode","Toggle between touch friendly or mouse friendly UI",!1),g=v.makeStringSetting("autoTouch","Automatic Touch Mode","Mode for automatically changing touch mode","every",ae),le=i=>{H(i,d.get),J(i,g.get)};d.addListener(i=>{for(let e=0;e<_.length;e++)H(_[e],i)});g.addListener(i=>{for(let e=0;e<_.length;e++)J(_[e],i)});let H=(i,e)=>{e?i.documentElement.classList.add("touch"):i.documentElement.classList.remove("touch")},O=i=>{switch(i.pointerType){case"touch":d.set=!0;break;case"mouse":case"pen":default:d.set=!1;break}},D=i=>{O(i);for(let e=0;e<_.length;e++)_[e].documentElement.removeEventListener("pointerdown",D)},J=(i,e)=>{switch(i.documentElement.removeEventListener("pointerdown",D),i.documentElement.removeEventListener("pointerdown",O),e){case"first":i.documentElement.addEventListener("pointerdown",D,{passive:!0});break;case"every":i.documentElement.addEventListener("pointerdown",O,{passive:!0});break}};const oe=Object.freeze(Object.defineProperty({__proto__:null,AutoTouchMode:A,touch:d,autoTouch:g,initTouch:le},Symbol.toStringTag,{value:"Module"}));let f=v.makeNumberSetting("scale","UI Scale","The scale of the UI",1,.2,4),he=async i=>{$(i)},j=16;f.addListener(i=>{j=i*16;for(let e=0;e<_.length;e++)$(_[e])});let $=i=>{i.documentElement.style.fontSize=j+"px"};const _e=Object.freeze(Object.defineProperty({__proto__:null,scale:f,initScale:he},Symbol.toStringTag,{value:"Module"}));let F=R(V,"TestVars","TestDescription");F.makeVariable("test","Test Name","Test Description","blue","black","Angle",void 0);F.makeVariable("test2","Test 2 Name","Test 2 Description","test","asdf","Number",{min:0,max:1});let z=document.body.appendChild(document.createElement("button"));z.innerHTML="Turn Auto Theme Off";z.addEventListener("click",()=>{S.set=!1});let q=document.body.appendChild(document.createElement("button"));q.innerHTML="Turn Auto Theme On";q.addEventListener("click",()=>{S.set=!0});let ue=p.enums;for(const i in ue){let e=document.body.appendChild(document.createElement("button"));e.innerHTML=i,e.addEventListener("click",()=>{p.set=i})}let K=document.body.appendChild(document.createElement("button"));K.innerHTML="Toggle Touch";K.addEventListener("click",async()=>{d.set=!await d.get});let P=document.body.appendChild(document.createElement("select"));for(const i in g.enums){let e=P.appendChild(document.createElement("option"));e.innerHTML=i}P.addEventListener("change",async i=>{g.set=i.currentTarget.selectedOptions[0].innerHTML});(async()=>P.value=await g.get)();let W=document.body.appendChild(document.createElement("button"));W.innerHTML="Scale Down";W.addEventListener("click",async()=>{f.set=await f.get-.2});let Q=document.body.appendChild(document.createElement("button"));Q.innerHTML="Scale Up";Q.addEventListener("click",async()=>{f.set=await f.get+.2});
