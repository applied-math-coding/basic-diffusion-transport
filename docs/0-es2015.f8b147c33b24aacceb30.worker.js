!function(t){var r={};function e(s){if(r[s])return r[s].exports;var i=r[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,e),i.l=!0,i.exports}e.m=t,e.c=r,e.d=function(t,r,s){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:s})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(e.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var i in t)e.d(s,i,(function(r){return t[r]}).bind(null,i));return s},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s="WZ91")}({HCFj:function(t,r,e){"use strict";var s;Object.defineProperty(r,"__esModule",{value:!0}),(s=r.Operator||(r.Operator={})).POWER="^",s.DIVISION="/",s.TIMES="*",s.ELEM_W_TIMES="%",s.MINUS="-",s.PLUS="+"},"U/uP":function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});const s=e("WrVD"),i=e("HCFj"),o=e("YMTH"),a=e("f2g5");var n,l,c;function h(t,e){const s=r.isBuildInMathFn(t),o=r.isBuildInMathFn(e);return s&&o?e.length-t.length:s?-1:o?1:Object.keys(i.Operator).findIndex(r=>r===t)-Object.keys(i.Operator).findIndex(t=>t===e)}function u(t=[]){const e=t.findIndex((e,s)=>!(e!==i.Operator.MINUS||r.is_number(t[s-1])||r.is_matrix(t[s-1])||t[s-1]===c.RIGHT));return e>-1?[...t.slice(0,e),c.LEFT,-1,c.RIGHT,i.Operator.TIMES,...u(t.slice(e+1))]:t}function d(t,e=r.all_operator_symbols){return f(t,e[0]).map(t=>e.length>1&&!r.all_operator_symbols.includes(t)?d(t,e.filter((t,r)=>r>0)):[p(t)]).reduce((t,r)=>[...t,...r],[])}function p(t){const e=parseFloat(t);if(r.all_operator_symbols.includes(t))return t;if(!Number.isNaN(e))return e;if(n.EQ===t)return t;throw new Error(`Cannot parse expression ${t} as ExpressionPart.`)}function f(t="",r){const e=t.indexOf(r);if(-1===e)return[t];{const s=e+r.length-1;return[...e>0?[t.substring(0,e)]:[],r,...s<t.length-1?f(t.substring(s+1),r):[]]}}function m(t){for(t=[...t];t.includes(c.LEFT);){const r=t.findIndex(t=>t===c.LEFT),e=w(t,r),s=m(t.slice(r+1,e));t=[...t.slice(0,r),s,...t.slice(e+1)]}const r=_(t).map(t=>g(t)).map(t=>t[0]);return r.length>1?r:r[0]}function _(t){const r=t.findIndex(t=>t===l.COMMA);return r<0?[t]:[t.slice(0,r),..._(t.slice(r+1))]}function w(t,r){let e=1;for(let[s,i]of t.slice(r+1).entries())if(i===c.RIGHT){if(1===e)return r+1+s;e-=1}else i===c.LEFT&&(e+=1);throw new Error("miss-matching parenthesis in expression")}function g(t){return t=[...t],r.all_operator_symbols.sort(h).forEach(e=>{for(;t.includes(e);){const s=t.findIndex(t=>e===t);if(r.isOperator(e)){const r=s-1,i=s+1,o=y(e,t[r],t[i]);t=[...t.slice(0,r),o,...t.slice(i+1)]}else if(r.isBuildInMathFn(e)){const r=s+1,i=O(e,t[r]);t=[...t.slice(0,s),i,...t.slice(r+1)]}}}),t}function y(t,r,e){const s="number"==typeof r,o="number"==typeof e;if(s&&o)switch(t){case i.Operator.PLUS:return r+e;case i.Operator.MINUS:return r-e;case i.Operator.POWER:return r**e;case i.Operator.DIVISION:return r/e;case i.Operator.ELEM_W_TIMES:case i.Operator.TIMES:return r*e;default:throw new Error(`Not supported operator ${t} between numbers.`)}const n=(t,r)=>a.mat(...r.shape()).fill(t);return r=s?n(r,e):r,e=o?n(e,r):e,!s&&!o||t!==i.Operator.TIMES&&t!==i.Operator.ELEM_W_TIMES?r[t](e):r.apply((t,r,s)=>t*e.get(r,s))}function O(t,r){if(Array.isArray(r)){const e=r.find(t=>t instanceof s.Matrix);if(e){const s=r.map(t=>"number"==typeof t?a.mat(...e.shape()).fill(t):t);return b(t,s)}return Math[""+t](...r)}return"number"==typeof r?Math[""+t](r):r.apply(r=>Math[""+t](r))}function b(t,r){const e=a.mat(...r[0].shape());for(let{row:s,col:i}of e.iter()){const o=Math[""+t](...r.map(t=>t.get(s,i)));e.set(s,i,o)}return e}!function(t){t.EQ="="}(n=r.Assignment||(r.Assignment={})),function(t){t.COMMA=","}(l=r.Separator||(r.Separator={})),function(t){t.LEFT="(",t.RIGHT=")"}(c=r.Bracket||(r.Bracket={})),r.all_operator_symbols=[...Object.values(n),...Object.values(c),...Object.values(l),...Object.values(i.Operator),...Object.values(o.BuildInMathFn)].sort((t,r)=>r.length-t.length),r.operator_map=Object.values(i.Operator).reduce((t,r)=>Object.assign(Object.assign({},t),{[r]:r}),{}),r.isOperator=t=>!!r.operator_map[t],r.buildInMathFn_map=Object.values(o.BuildInMathFn).reduce((t,r)=>Object.assign(Object.assign({},t),{[r]:r}),{}),r.isBuildInMathFn=t=>!!r.buildInMathFn_map[t],r.is_number=t=>"number"==typeof t,r.is_matrix=t=>t instanceof s.Matrix,r.operator_precedence=h,r.calc=function(t,...r){try{let e=t.map(t=>t.replace(/\s/g,"")).map((t,e)=>{const s=void 0!==r[e]?[r[e]]:[];return""!==t?[...d(t),...s]:[...s]}).reduce((t,r)=>[...t,...r],[]);if(e=u(e),e[1]!==n.EQ)return e.length>1?m(e):e[0]instanceof s.Matrix?e[0].clone():e[0];{const t=m(e.slice(2));!function(t,r){if("number"==typeof r)t.fill(r);else for(let{value:e,row:s,col:i}of r.iter())t.set(s,i,e)}(e[0],t)}}catch(e){throw new Error(e)}},r.transformSignOperator=u,r.splitOperators=d,r.parseAsExpressionPart=p,r.splitOperator=f,r.compute=m,r.split_components=_,r.findClosingBracket=w,r.combine=g,r.evaluateOp=y,r.evaluateFn=O,r.evaluateMultiArgFn=b},WZ91:function(t,r,e){"use strict";e.r(r);var s=e("YVAP");class i{constructor(t){this.L=1,this.g=9.81,this.duration=300,this.report_frequ=1,this.v_max=2,this.params=t,this.delta_x=this.L/this.params.n_grid,this.alpha=this.params.lambda/(this.params.rho*this.params.c_p),this.delta_t=this.calc_min_delta_t()}simulate(){console.log("Simulation starting with params:"),console.log(JSON.stringify(this.params));const t=Object(s.mat)(this.params.n_grid-2,this.params.n_grid-2).wrap(1).fill(this.params.T_c),r=Object(s.zeros)(this.params.n_grid,this.params.n_grid),e=Object(s.zeros)(this.params.n_grid,this.params.n_grid);let i;for(let s=0;s<=this.duration;s+=this.delta_t)o(t=>t).comp(t=>this.adjust_boundary(t)).comp(t=>this.time_adaptive_op(t)).comp(t=>this.params.includeBuoyancy?this.mom_convection_y_op(t):t).comp(t=>this.heat_convection_y_op(t)).comp(t=>this.diffusion_y_op(t)).comp(t=>this.diffusion_x_op(t)).comp(t=>this.adjust_boundary(t))({T:t,v_x:e,v_y:r}),(!i||s-i>=this.report_frequ)&&(postMessage({T:t.rawData(),t:s,delta_t:this.delta_t}),i=s)}time_adaptive_op(t){return this.v_max=s.calc`abs(${t.v_y})`.max(),this.delta_t=this.calc_min_delta_t(),t}calc_min_delta_t(){return Math.min(1,1/4*Math.pow(this.delta_x,2)/this.alpha,this.delta_x/this.v_max)}diffusion_x_op(t){let{T:r}=t;return r=r.shrink(1),s.calc`${r} = ${r} + ${this.alpha*this.delta_t/Math.pow(this.delta_x,2)}
      * (${r.shift_x(-1)} - 2 * ${r} + ${r.shift_x(1)})`,t}diffusion_y_op(t){let{T:r}=t;return r=r.shrink(1),s.calc`${r} = ${r} + ${this.alpha*this.delta_t/Math.pow(this.delta_x,2)}
      * (${r.shift_y(-1)} - 2 * ${r} + ${r.shift_y(1)})`,t}heat_convection_y_op(t){let{T:r,v_y:e}=t;return r=r.shrink(1),e=e.shrink(1),s.calc`${r} = ${r} -  ${e} % ${this.delta_t/this.delta_x} % (${r} - ${r.shift_y(-1)})`,t}mom_convection_y_op(t){let{T:r,v_y:e}=t;r=r.shrink(1);const i=r.shift_y(1),o=s.calc`${this.g} * max(0, (${r} - ${i})/${i})`;return e=e.shrink(1),s.calc`${e} = ${e} + ${this.delta_t} % ${o}
      - ${e} % ${this.delta_t/this.delta_x} % (${e} - ${e.shift_y(-1)})`,t}adjust_boundary(t){const{T:r,v_y:e}=t,[i,o]=r.shape();return r.filter(({row:t})=>0===t).fill(this.params.T_h),s.calc`${r.row(i-1)} = ${r.row(i-2)}`,s.calc`${r.col(0)} = ${r.col(1)}`,s.calc`${r.col(o-1)} = ${r.col(o-2)}`,s.calc`${e.row(i-1)} = ${e.row(i-2)}`,s.calc`${e.col(0)} = ${e.col(1)}`,s.calc`${e.col(o-1)} = ${e.col(o-2)}`,s.calc`${e.row(0)} = 0`,t}}function o(t){const r=r=>t(r);return r.comp=r=>o(e=>t(r(e))),r}addEventListener("message",({data:t})=>{new i(t).simulate()})},WrVD:function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});const s=e("HCFj");class i{constructor(t=0,r=0){this.rows=t,this.cols=r,this.initOperators(),this.data=[]}rawData(){return this.data}shape(){return[this.rows,this.cols]}clone(){const t=new i(this.rows,this.cols);for(let{value:r,row:e,col:s}of this.iter())null!=r&&t.set(e,s,r);return t}slice(...[t,r,e,s]){[t,r,e,s]=[...this.transToDataCoords(t,r),...this.transToDataCoords(e,s)];const o=new i(e-t+1,s-r+1);return o.data=this.data,o.coordFilter=this.coordFilter,o.sliceParams=[t,r,e,s],o}col(t){return this.slice(0,t,this.rows-1,t)}row(t){return this.slice(t,0,t,this.cols-1)}filter(t){const r=new i(this.rows,this.cols);r.data=this.data,r.coordFilter=[];for(let{row:e,col:s,value:i}of this.iter()){const[o,a]=this.transToDataCoords(e,s);r.coordFilter[o]||(r.coordFilter[o]=[]),r.coordFilter[o][a]=t({row:e,col:s,value:i})}return r}get(t,r){var e,s;return this.checkIndexes(t,r),[t,r]=this.transToDataCoords(t,r),this.checkFilterCoordinates(t,r),null===(s=null===(e=this.data)||void 0===e?void 0:e[t])||void 0===s?void 0:s[r]}fill(t){for(let{row:r,col:e}of this.iter())this.set(r,e,t);return this}shrink(t){return this.slice(t,t,this.rows-1-t,this.cols-1-t)}shift_x(t){return this.slice(0,t,this.rows-1,this.cols-1+t)}shift_y(t){return this.slice(t,0,this.rows-1+t,this.cols-1)}wrap(t){const r=this.clone();for(let e=1;e<=t;e++)r.addRow(0),r.addRow(r.rows),r.addColumn(0),r.addColumn(r.cols);return r}addRow(t,r=[]){if(this.coordFilter||this.sliceParams)throw new Error("Not supported for sliced or filtered matrixes.");this.rows=this.rows+1,this.data.splice(t,0,r)}addColumn(t,r=[]){var e;if(this.coordFilter||this.sliceParams)throw new Error("Not supported for sliced or filtered matrixes.");this.cols=this.cols+1;for(let s=0;s<this.data.length;s++)null===(e=this.data[s])||void 0===e||e.splice(t,0,r[s])}set(t,r,e){this.checkIndexes(t,r),this.data||(this.data=[]),[t,r]=this.transToDataCoords(t,r),this.checkFilterCoordinates(t,r),this.data[t]||(this.data[t]=[]),this.data[t][r]=e}iter(){return(function*(){for(let t=0;t<this.rows;t++)for(let r=0;r<this.cols;r++)this.isFilteredCoord(t,r)&&(yield{value:this.get(t,r),row:t,col:r})}).bind(this)()}print(){console.log("["),this.data.filter((t,r)=>!this.sliceParams||r>=this.sliceParams[0]&&r<=this.sliceParams[2]).forEach(t=>{const r=t.filter((t,r)=>!this.sliceParams||r>=this.sliceParams[1]&&r<=this.sliceParams[3]);console.log(`[${r}],`)}),console.log("]")}plus(t){return this.apply((r,e,s)=>r+t.get(e,s))}minus(t){return this.apply((r,e,s)=>r-t.get(e,s))}divide(t){return this.apply((r,e,s)=>r/t.get(e,s))}power(t){return this.apply((r,e,s)=>r**t.get(e,s))}elem_w_times(t){return this.apply((r,e,s)=>r*t.get(e,s))}times(t){if(this.coordFilter)throw new Error("Matrix multiplication not supported for filtered matrixes.");const r=new i(this.rows,t.cols);for(let{row:e,col:s}of r.iter()){let i=0;for(let r=0;r<this.cols;r++)i+=this.get(e,r)*t.get(r,s);r.set(e,s,i)}return r}mod(t){return this.apply((r,e,s)=>r%t.get(e,s))}max(){return Math.max(...[...this.iter()].map(({value:t})=>t))}min(){return Math.min(...[...this.iter()].map(({value:t})=>t))}apply(t){const r=this.clone();r.coordFilter=this.coordFilter;for(let{value:e,row:s,col:i}of this.iter())r.set(s,i,t(e,s,i));return r}checkIndexes(...[t,r]){if(t>this.rows||r>this.cols||t<0||r<0)throw new Error("Index out of bounds.")}initOperators(){Object.values(s.Operator).forEach(t=>{this[t]=this.createPartialFn(t)})}createPartialFn(t){return{[s.Operator.POWER]:t=>this.power(t),[s.Operator.TIMES]:t=>this.times(t),[s.Operator.ELEM_W_TIMES]:t=>this.elem_w_times(t),[s.Operator.DIVISION]:t=>this.divide(t),[s.Operator.PLUS]:t=>this.plus(t),[s.Operator.MINUS]:t=>this.minus(t)}[t]}transToDataCoords(t,r){return[this.sliceParams?this.sliceParams[0]+t:t,this.sliceParams?this.sliceParams[1]+r:r]}checkFilterCoordinates(t,r){if(this.coordFilter&&!this.coordFilter[t][r])throw new Error(`Coordinates ${t}, ${r} are not in filtered range.`)}isFilteredCoord(t,r){return[t,r]=this.transToDataCoords(t,r),!this.coordFilter||this.coordFilter[t][r]}}r.Matrix=i},YMTH:function(t,r,e){"use strict";var s;Object.defineProperty(r,"__esModule",{value:!0}),(s=r.BuildInMathFn||(r.BuildInMathFn={})).abs="abs",s.acos="acos",s.acosh="acosh",s.asin="asin",s.asinh="asinh",s.atan="atan",s.atanh="atanh",s.ceil="ceil",s.cbrt="cbrt",s.cos="cos",s.cosh="cosh",s.exp="exp",s.floor="floor",s.log="log",s.log1p="log1p",s.log2="log2",s.log10="log10",s.max="max",s.min="min",s.pow="pow",s.round="round",s.sign="sign",s.sin="sin",s.sinh="sinh",s.sqrt="sqrt",s.tan="tan",s.tanh="tanh",s.trunc="trunc"},YVAP:function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=e("U/uP");r.calc=s.calc;var i=e("f2g5");r.mat=i.mat,r.zeros=i.zeros;var o=e("WrVD");r.Matrix=o.Matrix},f2g5:function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});const s=e("WrVD");function i(...t){if(t[0]instanceof s.Matrix)return t[0].clone();if(Array.isArray(t[0])){const r=t[0].length,e=t[0].find(t=>t&&Array.isArray(t)),i=new s.Matrix(r,e?e.length:1);return t[0].forEach((t,r)=>t&&t.forEach((t,e)=>t&&i.set(r,e,t))),i}{const[r,e]=t;return new s.Matrix(r,e)}}r.mat=i,r.zeros=function(t,r){const e=i(t,r);for(let{row:s,col:i}of e.iter())e.set(s,i,0);return e},r.randu=function(t,r){const e=i(t,r);for(let{row:s,col:i}of e.iter())e.set(s,i,Math.random());return e}}});