!function(){"use strict";const t=document.querySelector(".sb-wordlist-items"),s={};let e,a=[],n=[],o=[],r=0;const i=(t,{text:s="",classNames:e=[],attributes:a={}}={})=>{const n=document.createElement(t);e.length&&n.classList.add(...e),""!==s&&(n.textContent=s);for(const[t,s]of Object.entries(a))s&&n.setAttribute(t,s);return n},d=t=>{let s=0;return t.forEach(t=>{gameData.today.pangrams.includes(t)?s+=15:t.length>4?s+=t.length:s+=1}),s};r=d(gameData.today.answers);const l=()=>{const t=(()=>{const t={};return gameData.today.answers.forEach(s=>{t[s.length]=t[s.length]||{found:0,missing:0,total:0},a.includes(s)?t[s.length].found++:t[s.length].missing++,t[s.length].total++}),t})(),s=Object.keys(t);s.sort((t,s)=>t-s);const e={Stats:[["Words",a.length,o.length,gameData.today.answers.length],["Points",d(a),d(o),r]],Spoilers:[["Pangrams",n.length,gameData.today.pangrams.length-n.length,gameData.today.pangrams.length]]};return s.forEach(s=>{e.Spoilers.push([s+" "+(s>1?"letters":"letter"),t[s].found,t[s].missing,t[s].total])}),e},c=()=>{a=[],n=[],t.querySelectorAll("li").forEach(t=>{const s=t.textContent;a.push(s),gameData.today.pangrams.includes(s)&&(n.push(s),t.classList.add("sb-pangram"))}),o=gameData.today.answers.filter(t=>!a.includes(t));const e=l();for(const[t,a]of Object.entries(s))e[t].length&&(a.innerHTML="",e[t].forEach(t=>{a.append(g("td",t))}))},p=()=>{confirm("Are you sure you want to display all answers?")&&(e.disconnect(),o.forEach(s=>{t.append((t=>{const s=i("li",{classNames:gameData.today.pangrams.includes(t)?["sb-anagram","sb-pangram"]:["sb-anagram"]});return s.append(i("a",{text:t,attributes:{href:`https://www.google.com/search?q=${t}`,target:"_blank"}})),s})(s))}))},g=(t,s)=>{const e=i("tr");return s.forEach((s,a)=>{e.append(i(0===a?"th":t,{text:s}))}),e};(e=new MutationObserver((t,s)=>{const e=t.pop().addedNodes[0];gameData.today.pangrams.includes(e.textContent)&&e.classList.add("sb-pangram"),c()})).observe(t,{childList:!0});(()=>"https://www.nytimes.com/puzzles/spelling-bee"===window.location.href&&!e&&((()=>{const t=i("style",{text:".sb-content-box{position:relative}.sb-wordlist-items .sb-pangram{border-bottom:2px #f8cd05 solid}.sb-wordlist-items .sb-anagram a{color:#888}.sb-assistant{position:absolute;width:200px;right:-210px;top:16px}.sb-assistant *{box-sizing:border-box}.sb-assistant details{font-size:90%;margin-bottom:10px}.sb-assistant summary{padding:9px 15px;background:#f8cd05;cursor:pointer}.sb-assistant .solution-content{padding:10px 15px}.sb-assistant table{border:1px solid #dcdcdc;border-collapse:collapse;width:100%;font-size:85%}.sb-assistant th,.sb-assistant td{border:1px solid #dcdcdc;padding:3px}.sb-assistant thead th{text-align:center}.sb-assistant tbody th{text-align:right}.sb-assistant tbody td{text-align:center}"});document.querySelector("head").append(t)})(),(()=>{const t=document.querySelector(".sb-content-box"),e=i("div",{classNames:["sb-assistant"]});["Stats","Spoilers","Solution"].forEach(t=>{const a=i("details",{attributes:{open:"Stats"===t&&"open"}}),n=i("summary",{text:t});let o;if("Solution"===t){o=i("div",{classNames:["solution-content"]});const t=i("button",{classNames:["pz-modal__button","white"],text:"Display answers",attributes:{type:"button"}});t.addEventListener("pointerup",t=>{p()}),o.append(t)}else{o=i("table");const e=i("thead");e.append(g("th",["","Found","Missing","Total"])),s[t]=i("tbody"),o.append(e),o.append(s[t]),c()}a.append(n),a.append(o),e.append(a)}),t.append(e)})(),c(),!0))()}();