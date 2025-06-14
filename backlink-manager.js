// Backlink Management for QUANTUM TOOLS
// This script implements tracking and management of backlinks

class BacklinkManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupBacklinkTracker();
        this.setupInfluencerTracking();
        this.setupOutreachMonitoring();
        this.setupAttributionDetection();
    }

    // Track backlinks via UTM parameters
    setupBacklinkTracker() {
        // Check for UTM parameters in URL
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        
        // If this is a backlink visit, track it
        if (utmSource && (utmMedium === 'backlink' || utmMedium === 'referral')) {
            this.logBacklinkVisit(utmSource, utmMedium, utmCampaign);
        }
        
        // Check referrer
        const referrer = document.referrer;
        if (referrer && !referrer.includes(window.location.hostname)) {
            this.logReferrerVisit(referrer);
        }
    }
    
    logBacklinkVisit(source, medium, campaign) {
        // Send to analytics
        if (window.gtag) {
            gtag('event', 'backlink_visit', {
                'source': source,
                'medium': medium,
                'campaign': campaign || 'not_set'
            });
        }
        
        // Store in local storage for attribution
        const backlinkData = {
            source,
            medium,
            campaign,
            timestamp: new Date().toISOString()
        };
        
        // Store for 30 days
        localStorage.setItem('quantum_backlink_source', JSON.stringify(backlinkData));
    }
    
    logReferrerVisit(referrer) {
        try {
            const referrerURL = new URL(referrer);
            const referrerDomain = referrerURL.hostname;
            
            // Send to analytics
            if (window.gtag) {
                gtag('event', 'referrer_visit', {
                    'referrer': referrerDomain,
                    'full_referrer': referrer
                });
            }
            
            // Store last referrer
            localStorage.setItem('quantum_last_referrer', referrerDomain);
        } catch (e) {
            console.error('Invalid referrer URL', e);
        }
    }

    // Track influencer-driven traffic
    setupInfluencerTracking() {
        const urlParams = new URLSearchParams(window.location.search);
        const influencerCode = urlParams.get('inf') || urlParams.get('influencer');
        
        if (influencerCode) {
            // Track influencer visit
            if (window.gtag) {
                gtag('event', 'influencer_visit', {
                    'influencer_code': influencerCode
                });
            }
            
            // Store for attribution
            localStorage.setItem('quantum_influencer', influencerCode);
            
            // If using a cookie-based approach
            document.cookie = `quantum_influencer=${influencerCode};path=/;max-age=2592000`; // 30 days
        }
    }

    // Monitor outreach campaigns
    setupOutreachMonitoring() {
        const urlParams = new URLSearchParams(window.location.search);
        const outreachID = urlParams.get('outreach') || urlParams.get('campaign');
        
        if (outreachID) {
            // Track outreach campaign visit
            if (window.gtag) {
                gtag('event', 'outreach_campaign_visit', {
                    'outreach_id': outreachID
                });
            }
        }
    }

    // Detect if user converts after coming from a backlink
    setupAttributionDetection() {
        // Add event listeners to important actions
        document.addEventListener('click', (e) => {
            // Check if this is a tool usage action
            if (e.target.matches('.tool-button, .start-button, .download-button')) {
                this.attributeAction('tool_usage', e.target.dataset.tool || 'unknown_tool');
            }
            
            // Check if this is a newsletter signup
            if (e.target.matches('.newsletter-submit, .subscribe-button')) {
                this.attributeAction('newsletter_signup');
            }
        });
    }
    
    attributeAction(actionType, actionDetail = null) {
        // Check if user came from a backlink
        const backlinkData = localStorage.getItem('quantum_backlink_source');
        const influencer = localStorage.getItem('quantum_influencer');
        const lastReferrer = localStorage.getItem('quantum_last_referrer');
        
        if (backlinkData || influencer || lastReferrer) {
            // Send attribution data to analytics
            if (window.gtag) {
                gtag('event', 'attributed_action', {
                    'action_type': actionType,
                    'action_detail': actionDetail,
                    'backlink_data': backlinkData || 'none',
                    'influencer': influencer || 'none',
                    'last_referrer': lastReferrer || 'none'
                });
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const backlinkManager = new BacklinkManager();
});
