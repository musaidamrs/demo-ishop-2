try{document.documentElement.dataset.theme=localStorage.getItem('ishop-theme')||'dark'}catch{document.documentElement.dataset.theme='dark'}

// Extend only iOS Safari into its safe-area viewport, before first paint.
(()=>{const ua=navigator.userAgent;if(/iPhone|iPad|iPod/.test(ua)&&/Safari/.test(ua)&&!/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(ua)&&!navigator.standalone&&!matchMedia('(display-mode: standalone)').matches){document.documentElement.classList.add('ios-safari');const viewport=document.querySelector('meta[name="viewport"]');if(viewport)viewport.content='width=device-width,initial-scale=1,viewport-fit=cover'}})();
