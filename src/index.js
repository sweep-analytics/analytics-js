import Sweep from './sweep';
import { trackPageViews, trackEvents, trackErrors } from './sweep';

const api = getSyncScriptParams();

// check if document is ready ( Browsers > IE8 )
document.addEventListener("DOMContentLoaded", () => {

    // init Sweep
    const sweepInit = new Sweep(api.key);

    // track page view
    trackPageView();

    // track click events
    const clickEvents = [].slice.call(document.querySelectorAll('[data-sweep-click]'));
    clickEvents.forEach((clickEvent) => {

        clickEvent.addEventListener('click', (el) => {
            const eventData = el.target.getAttribute('data-sweep-click');
            trackEvent('click', { ...eventData.split(",") });
        });

    });

    if ('true' === api.logs) {
        trackLogs();
    }

});

// tracking functions
const trackEvent = ( name, data ) => {
    trackEvents(name, data);
};

const trackPageView = () => {
    trackPageViews();
};

const trackLogs = () => {
    trackErrors();
};

// helper functions
function getSyncScriptParams() {
    const scripts = document.currentScript;
    // console.log(scripts.getAttribute('key'));
    return {
        key : scripts.getAttribute('key'),
        logs : scripts.getAttribute('logs'),
    };
}
