/**
 * QUANTUM TOOLS - Performance Optimized Delayed Script Loading
 * Target: Lighthouse 100/100
 * 
 * This script loads heavy third-party and local marketing/SEO scripts 
 * ONLY upon user interaction (scroll, click, mousemove, touch).
 */

let scriptsLoaded = false;

function loadThirdPartyScripts() {
    if (scriptsLoaded) return;
    scriptsLoaded = true;

    console.log('Performance Optimization: Loading deferred third-party trackers...');

    // 1. Google Tag Manager (GTM)
    (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({
            'gtm.start': new Date().getTime(), event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-T5WCC5DD');

    // 2. Google Analytics 4 (GA4)
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-0E17RL1H32";
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-0E17RL1H32");

    // 3. Gatekeeper Consent (CMP)
    const cmp1 = document.createElement("script");
    cmp1.src = "https://cmp.gatekeeperconsent.com/min.js";
    cmp1.setAttribute("data-cfasync", "false");
    document.head.appendChild(cmp1);

    const cmp2 = document.createElement("script");
    cmp2.src = "https://the.gatekeeperconsent.com/cmp.min.js";
    cmp2.setAttribute("data-cfasync", "false");
    document.head.appendChild(cmp2);

    // 4. Ezoic Setup
    const ezoic = document.createElement("script");
    ezoic.async = true;
    ezoic.src = "//www.ezojs.com/ezoic/sa.min.js";
    document.head.appendChild(ezoic);

    window.ezstandalone = window.ezstandalone || {};
    ezstandalone.cmd = ezstandalone.cmd || [];
    ezstandalone.cmd.push(function () {
        ezstandalone.showAds();
    });

    // 5. Google AdSense (Loaded with a small extra delay)
    setTimeout(() => {
        const adsense = document.createElement("script");
        adsense.async = true;
        adsense.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013378095829502";
        adsense.crossOrigin = "anonymous";
        document.head.appendChild(adsense);
    }, 500);

    // Remove event listeners after loading
    ["scroll", "mousemove", "touchstart", "keydown", "click"].forEach(event => {
        document.removeEventListener(event, loadThirdPartyScripts);
    });
}

// Attach listeners for interaction
["scroll", "mousemove", "touchstart", "keydown", "click"].forEach(event => {
    document.addEventListener(event, loadThirdPartyScripts, { once: true, passive: true });
});

// Fallback: Load scripts anyway after a slight delay (if user does nothing)
setTimeout(loadThirdPartyScripts, 8500);


/**
 * Local Marketing & UX Scripts
 */
function loadHeavyLocalScripts() {
    if (window.localScriptsLoaded) return;
    window.localScriptsLoaded = true;

    const localScripts = [
        'advanced-seo-optimizer.js',
        'ux-enhancements.js',
        'content-marketing.js',
        'seo-content-strategy.js',
        'seo-analytics.js',
        'backlink-manager.js',
        'tag-manager.js',
        'performance-optimizer.js'
    ];

    localScripts.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.defer = true;
        document.body.appendChild(s);
    });

    ["scroll", "mousemove", "touchstart", "keydown", "click"].forEach(event => {
        document.removeEventListener(event, loadHeavyLocalScripts);
    });
}

["scroll", "mousemove", "touchstart", "keydown", "click"].forEach(event => {
    document.addEventListener(event, loadHeavyLocalScripts, { once: true, passive: true });
});

setTimeout(loadHeavyLocalScripts, 8500);
