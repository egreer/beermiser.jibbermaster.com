if(!self.define){let e,i={};const r=(r,n)=>(r=new URL(r+".js",n).href,i[r]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=i,document.head.appendChild(e)}else e=r,importScripts(r),i()})).then((()=>{let e=i[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(n,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let d={};const c=e=>r(e,o),t={module:{uri:o},exports:d,require:c};i[o]=Promise.all(n.map((e=>t[e]||c(e)))).then((e=>(s(...e),d)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"8641b4934996c32e997a0da41b6ab4d9"},{url:"assets/index-CDx1uJcv.css",revision:null},{url:"assets/index-CqhI6FUs.js",revision:null},{url:"favicon.ico",revision:"156a50ac54521264f5955ef382b310b8"},{url:"icon/beer-128.png",revision:"f164f776ed891c2410943ad1641d8e09"},{url:"icon/beer-256.png",revision:"a17560e5d8d4b813dddfa664ad6f0dd0"},{url:"icon/beer-64.png",revision:"3f0f83f51a388960c1e758de26ac2ff0"},{url:"icon/beer.ico",revision:"156a50ac54521264f5955ef382b310b8"},{url:"icon/beer.png",revision:"96d0bffd771e62965542b2e8f729673a"},{url:"index.html",revision:"837ef04e358ad8ed15f9990012d1ccea"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
