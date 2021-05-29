(this["webpackJsonpbeermiser.jibbermaster.com"]=this["webpackJsonpbeermiser.jibbermaster.com"]||[]).push([[0],{48:function(e,t,n){},51:function(e,t,n){},64:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(15),s=n.n(r),i=(n(48),n(19)),l=n(21),o=n(22),d=n(24),j=n(23),u=n(18),b=n(40),h=n(8),m=(n(51),n(71)),O=n(66),x=n(39),p=n(67),v=n(72),f=n(68),g=n(69),w=n(7),C=n(31),S=n.n(C),N=n(17),y=n.n(N),z=n(42),k=n(70),B=n(1),_=function(e){var t=e.onConfirm,n=e.triggerText,c=e.triggerButtonParams,r=e.headerText,s=void 0===r?"Confirm?":r,l=e.bodyText,o=e.confirmText,d=void 0===o?"Save":o,j=e.confirmVariant,u=void 0===j?"primary":j,b=Object(a.useState)(!1),h=Object(z.a)(b,2),m=h[0],O=h[1],p=function(e){O(!1),e&&t()},f=Object(B.jsx)(k.a.Header,{children:Object(B.jsx)(k.a.Title,{children:s})}),g=Object(B.jsx)(k.a.Body,{children:l||"Confirm?"});return Object(B.jsxs)(B.Fragment,{children:[Object(B.jsxs)(k.a,{show:m,onHide:p,animation:!0,contentClassName:"bg-dark text-light noselect",children:[f,l&&g,Object(B.jsxs)(k.a.Footer,{children:[Object(B.jsx)(x.a,{children:Object(B.jsx)(v.a,{variant:"secondary","aria-label":"Close Confirmation Modal",onClick:function(){return p(!1)},block:!0,children:"Close"})}),Object(B.jsx)(x.a,{children:Object(B.jsx)(v.a,{variant:u,"aria-label":d,onClick:function(){return p(!0)},block:!0,children:d})})]})]}),Object(B.jsx)(v.a,Object(i.a)(Object(i.a)({onClick:function(){return O(!0)},"aria-label":n},c),{},{children:n}))]})},A={id:y()(),volume:"",volume_unit:"Oz",price:"",calculation:null,apv_calculation:null,ppv_calculation:null},F={id:y()(),name:"",alcohol:"",alcohol_unit:"APV",sizes:[Object(w.cloneDeep)(A)]},T={stored:[],brew:Object(w.cloneDeep)(F)},V=function(e){Object(d.a)(n,e);var t=Object(j.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return(e=t.call.apply(t,[this].concat(r))).state=Object(w.cloneDeep)(T),e.componentDidMount=function(){var t=S.a.get("beermiser-state")||Object(w.cloneDeep)(T);e.setState(t)},e.persistState=function(t,n){e.setState(t,(function(){S.a.set("beermiser-state",e.state),Object(w.isFunction)(n)&&n()}))},e.handleChange=function(t){var n=e.state.brew;e.persistState({brew:Object(w.set)(n,t.target.name,t.target.value)},e.updateCalculation)},e.handleVolumeChange=function(t,n){console.log(t,n);var a=e.state.brew;e.state.brew.sizes.map((function(e){return e.id===n&&Object(w.set)(e,t.target.name,t.target.value),e})),e.persistState(a,e.updateCalculation)},e.currentValid=function(){var t=e.state.brew,n=Object(w.some)(t.sizes,(function(e){return e.volume||e.price}));return t.name||t.alcohol||n},e.saveCurrent=function(){console.log("Save Current",e.state);var t=e.state,n=t.brew,a=t.stored;n.id=y()(),n.sizes.forEach((function(t){t.id=y()(),a.push(e.buildBrewSize(n,t))})),e.persistState(Object(w.assign)(Object(w.cloneDeep)(T),{stored:Object(w.orderBy)(a,["calculation","apv_calculation","ppv_calculation"],["asc","desc","asc"])}))},e.buildBrewSize=function(e,t){console.log("brew",e),console.log("size",t);var n=Object(w.assign)({},e,t);return console.log("brewSize",n),Object(w.assign)(n,{brewId:e.id,id:t.id,sizes:[]}),n},e.updateCalculation=function(){e.persistState({brew:e.calculateCalculations(e.state.brew)})},e.calculateCalculations=function(e){var t=e.alcohol,n=e.alcohol_unit;return e.sizes.forEach((function(e){var a=e.volume,c=e.volume_unit,r=e.price,s=parseFloat(t),i=parseFloat(a),l=null,o=null,d=null;t&&"ABW"===n&&(s=1.25*parseFloat(t)),a&&"mL"===c?i=.03381*parseFloat(a):a&&"L"===c&&(i=1e3*parseFloat(a)*.03381),s&&s>0&&i&&i>0&&(l=s/100*i),i&&i>0&&r&&parseFloat(r)>0&&(o=parseFloat(r)/i),s&&s>0&&i&&i>0&&r&&parseFloat(r)>0&&(d=parseFloat(r)/(s/100*i)),Object(w.assign)(e,{calculation:d,apv_calculation:l,ppv_calculation:o})})),e},e.reCalculateAll=function(){var t=e.state.stored;t.forEach((function(t){Object(w.assign)(t,e.calculateCalculations(t))})),e.persistState({stored:Object(w.orderBy)(t,["calculation","apv_calculation","ppv_calculation"],["asc","desc","asc"])})},e.removeActiveBrewSize=function(t){var n=e.state.brew;Object(w.remove)(n.sizes,(function(e){return e.id===t})),e.persistState({brew:n})},e.removeBrewSize=function(t){var n=e.state.stored;Object(w.remove)(n,(function(e){return e.id===t})),e.persistState({stored:n})},e.removeBrew=function(t){var n=e.state.stored;Object(w.remove)(n,(function(e){return e.brewId===t})),e.persistState({stored:n})},e.editBrew=function(t){e.currentValid()&&e.saveCurrent();var n=e.rebuildBrew(t.brewId);e.persistState({brew:n}),e.removeBrew(n.id)},e.rebuildBrew=function(t){var n=e.state.stored.filter((function(e){return e.brewId===t})),a={id:t,name:n[0].name,alcohol:n[0].alcohol,alcohol_unit:n[0].alcohol_unit,sizes:n};return n.forEach((function(e){delete e.name,delete e.alcohol,delete e.alcohol_unit})),a},e.addSize=function(){var t,n=e.state.brew,a=Object(w.cloneDeep)(A);a.id=y()(),a.volume_unit=(null===(t=Object(w.last)(n.sizes))||void 0===t?void 0:t.volume_unit)||a.volume_unit,n.sizes.push(a),e.persistState({brew:n})},e.reset=function(){e.persistState(Object(w.cloneDeep)(T))},e.renderSizes=function(t){return null===t||void 0===t?void 0:t.map((function(n,a){return Object(B.jsxs)(m.a.Group,{as:O.a,children:[Object(B.jsx)(x.a,{xs:{span:6},children:Object(B.jsxs)(p.a,{children:[Object(B.jsx)(m.a.Control,{type:"number",name:"volume",placeholder:"Volume",value:n.volume,onChange:function(t){return e.handleVolumeChange(t,n.id)},min:0}),Object(B.jsx)(p.a.Append,{children:Object(B.jsxs)(m.a.Control,{as:"select",name:"volume_unit",value:n.volume_unit,className:"rounded-right",style:{borderRadius:0},onChange:function(t){return e.handleVolumeChange(t,n.id)},children:[Object(B.jsx)("option",{children:"Oz"}),Object(B.jsx)("option",{children:"mL"}),Object(B.jsx)("option",{children:"L"})]})})]})}),Object(B.jsx)(x.a,{xs:{span:4},className:"pr-1",children:Object(B.jsxs)(p.a,{children:[Object(B.jsx)(m.a.Control,{type:"number",name:"price",placeholder:"Price",value:n.price,onChange:function(t){return e.handleVolumeChange(t,n.id)},min:0,step:.01}),Object(B.jsx)(p.a.Append,{children:Object(B.jsx)(p.a.Text,{children:"$"})})]})}),Object(B.jsx)(x.a,{xs:{span:2},children:Object(B.jsx)(v.a,{variant:"danger",block:!0,disabled:t.length<=1,onClick:function(){return e.removeActiveBrewSize(n.id)},"aria-label":"Remove Brew Size",children:Object(B.jsx)("i",{className:"fa fa-trash"})})})]},a)}))},e.renderCalculations=function(t){return Object(B.jsxs)(f.a,{variant:"success",className:"my-4 rounded",size:"sm",hover:!0,striped:!0,borderless:!0,responsive:!0,children:[Object(B.jsx)("thead",{children:Object(B.jsxs)("tr",{children:[Object(B.jsx)("th",{}),Object(B.jsxs)("th",{className:"noselect text-nowrap",children:[Object(B.jsx)("sup",{children:"$"}),"/",Object(B.jsx)("sub",{children:"oz"})]}),Object(B.jsx)("th",{className:"noselect text-nowrap",children:"Alc"}),Object(B.jsxs)("th",{className:"noselect text-nowrap",children:[Object(B.jsx)("sup",{children:"$"}),"/",Object(B.jsx)("sub",{children:"A"})]})]})}),Object(B.jsx)("tbody",{children:t.sizes.map((function(t,n){return e.renderCalculation(t,n)}))})]})},e.renderCalculation=function(t,n){if(t){var a=t.volume,r=t.volume_unit;return Object(B.jsx)(c.a.Fragment,{children:Object(B.jsxs)("tr",{children:[Object(B.jsx)("td",{className:"align-middle",children:Object(B.jsxs)("div",{children:[Object(B.jsx)("span",{className:"mr-1",children:a}),Object(B.jsx)("small",{children:r})]})}),e.renderCalculationColums(t)||Object(B.jsx)("td",{colSpan:3,children:"Calculating...."})]})},n)}},e.renderCalculationColums=function(e){var t=e.calculation,n=e.apv_calculation,a=e.ppv_calculation;if(t||n||a)return Object(B.jsxs)(B.Fragment,{children:[Object(B.jsx)("td",{className:"align-middle",children:a&&a.toFixed(3)}),Object(B.jsx)("td",{className:"align-middle",children:n&&n.toFixed(3)}),Object(B.jsx)("td",{className:"align-middle",children:t&&t.toFixed(3)})]})},e.renderResults=function(){var t=e.state.stored.map((function(t){return Object(B.jsx)(c.a.Fragment,{children:Object(B.jsxs)("tr",{children:[Object(B.jsxs)("td",{className:"align-middle text-left",children:[Object(B.jsx)("div",{className:"mb-2",children:t.name}),Object(B.jsxs)(g.a,{children:[Object(B.jsx)(v.a,{variant:"secondary",onClick:function(){return e.editBrew(t)},size:"sm","aria-label":"Edit ".concat(t.name),children:Object(B.jsx)("i",{className:"fa fa-edit px-1"})}),Object(B.jsx)(v.a,{variant:"danger",onClick:function(){return e.removeBrewSize(t.id)},size:"sm","aria-label":"Remove ".concat(t.name),children:Object(B.jsx)("i",{className:"fa fa-times px-1"})})]})]}),Object(B.jsxs)("td",{className:"align-middle text-left",children:[Object(B.jsx)("div",{children:t.price&&"$".concat(parseFloat(t.price).toFixed(2))}),Object(B.jsxs)("div",{children:[Object(B.jsx)("span",{className:"mr-1",children:t.alcohol}),Object(B.jsx)("small",{children:t.alcohol_unit})]}),Object(B.jsxs)("div",{children:[Object(B.jsx)("span",{className:"mr-1",children:t.volume}),Object(B.jsx)("small",{children:t.volume_unit})]})]}),e.renderCalculationColums(t)]})},t.id)}));return t.length>0&&Object(B.jsxs)(f.a,{variant:"dark",className:"my-4",size:"sm",hover:!0,responsive:!0,children:[Object(B.jsx)("thead",{children:Object(B.jsxs)("tr",{children:[Object(B.jsx)("th",{}),Object(B.jsx)("th",{}),Object(B.jsxs)("th",{className:"noselect text-nowrap",children:[Object(B.jsx)("sup",{children:"$"}),"/",Object(B.jsx)("sub",{children:"oz"})]}),Object(B.jsx)("th",{className:"noselect text-nowrap",children:"Alc"}),Object(B.jsxs)("th",{className:"noselect text-nowrap",children:[Object(B.jsx)("sup",{children:"$"}),"/",Object(B.jsx)("sub",{children:"A"})]})]})}),Object(B.jsx)("tbody",{children:t})]})},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this.state.brew,t=e.name,n=e.alcohol,a=e.alcohol_unit,c=e.sizes;return Object(B.jsxs)("div",{className:"home",children:[Object(B.jsx)(u.a,{title:"BeerMiser",children:Object(B.jsx)("link",{rel:"manifest",href:"/manifest.json"})}),Object(B.jsx)("h1",{className:"text-center pt-2",children:"BeerMiser"}),Object(B.jsxs)(m.a,{className:"mt-4",autoComplete:"off",children:[Object(B.jsx)(m.a.Group,{as:O.a,children:Object(B.jsx)(x.a,{sm:12,children:Object(B.jsx)(p.a,{children:Object(B.jsx)(m.a.Control,{type:"text",name:"name",placeholder:"Name",value:t,onChange:this.handleChange})})})}),Object(B.jsx)(m.a.Group,{as:O.a,children:Object(B.jsx)(x.a,{sm:12,children:Object(B.jsxs)(p.a,{children:[Object(B.jsx)(m.a.Control,{type:"number",name:"alcohol",placeholder:"Alcohol",value:n,onChange:this.handleChange,min:0}),Object(B.jsx)(p.a.Append,{children:Object(B.jsxs)(m.a.Control,{as:"select",name:"alcohol_unit",value:a,className:"rounded-right",style:{borderRadius:0},onChange:this.handleChange,children:[Object(B.jsx)("option",{children:"APV"}),Object(B.jsx)("option",{children:"ABW"})]})})]})})}),this.renderSizes(c),Object(B.jsx)(O.a,{className:"my-4",children:Object(B.jsx)(x.a,{sm:{span:6,offset:6},children:Object(B.jsx)(v.a,{block:!0,variant:"secondary",onClick:this.addSize,"aria-label":"Add Brew Size",children:"Add Size"})})}),Object(B.jsx)(O.a,{className:"my-4",children:Object(B.jsx)(x.a,{children:Object(B.jsx)("div",{className:"text-center my-2",children:this.renderCalculations(e)})})}),Object(B.jsx)(O.a,{className:"my-4",children:Object(B.jsx)(x.a,{sm:{span:6,offset:6},children:Object(B.jsx)(v.a,{block:!0,variant:"success",onClick:this.saveCurrent,disabled:!this.currentValid(),"aria-label":"Save Current Brew",children:"Save"})})})]}),Object(B.jsx)(O.a,{children:Object(B.jsx)(x.a,{children:Object(B.jsx)("div",{className:"text-center",children:this.renderResults()})})}),Object(B.jsx)("div",{className:"pt-5 pb-3",children:Object(B.jsx)(_,{onConfirm:this.reset,triggerText:"Reset",confirmText:"Reset",headerText:"Reset Brews?",confirmVariant:"danger",triggerButtonParams:{block:!0,variant:"danger"}})})]})}}]),n}(a.Component),R=function(e){Object(d.a)(n,e);var t=Object(j.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,c=new Array(a),r=0;r<a;r++)c[r]=arguments[r];return(e=t.call.apply(t,[this].concat(c))).state={isOpen:!1,disclaimerDismissed:!1,displayText:!1,displayImages:!1,devTools:!1,displayGatherer:!1},e.toggle=function(){e.setState({isOpen:!e.state.isOpen})},e}return Object(o.a)(n,[{key:"render",value:function(){return Object(B.jsx)(b.a,{children:Object(B.jsxs)(u.b,{children:[Object(B.jsx)(u.a,{titleTemplate:"%s - Jibbermaster"}),Object(B.jsx)("div",{className:"app text-light bg-dark col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3",children:Object(B.jsx)(h.c,{children:Object(B.jsx)(h.a,{path:"/",exact:!0,render:function(e){return Object(B.jsx)(V,Object(i.a)({},e))}})})})]})})}}]),n}(a.Component),W=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function D(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}s.a.render(Object(B.jsx)(R,{}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");W?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):D(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):D(t,e)}))}}()}},[[64,1,2]]]);
//# sourceMappingURL=main.172137f1.chunk.js.map