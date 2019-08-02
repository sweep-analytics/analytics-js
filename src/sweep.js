import uuidv4 from "@bundled-es-modules/uuid/v4.js";
import { cookieSet, cookieGet } from './cookies';

export default class Sweep {

    constructor(apiKey) {
        this.clientId = apiKey;

        window.sweep = {
            sweepApiKey: apiKey
        };
    }

    // Track user flow
    // trackUserFlow() {}

    // Track user flow
    // trackUserDuration() {}

}

const trackEventMutation = () => `mutation trackEvent($name: String!, $client: String!, $meta: JSON) {
  trackEvent(input: { name: $name, client: $client, meta: $meta }) { 
    name,
    client,
    meta
  }
}`;

export function trackPageViews(screen) {
    console.log('trackPageViews');

    if (!cookieGet('s_a_js_uid')) {
        cookieSet('s_a_js_uid', uuidv4());
    }

    const clientId = window.sweep.sweepApiKey;

    if (!clientId) {
        throw new Error('No api key provided');
    }

    console.log(cookieGet('s_a_js_uid'));

    const url = document.location.pathname;
    const referrer = document.referrer;
    const language = navigator.language;
    const platform = navigator.platform;
    const size = `${window.screen.width}x${window.screen.height}`;

    const meta = {
        url,
        referrer,
        anonymousId: cookieGet('s_a_js_uid'),
        language,
        platform,
        screen: size
    };

    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            operationName: 'trackEvent',
            query: trackEventMutation(),
            variables: {
                name: 'userSession',
                client: clientId,
                meta
            }
        })
    };

    fetch(`https://api.sweep-analytics.com/public`, options)
        .then((res) => {
            // console.log(res.json());
        })
        .catch((err) => {
            console.log(err);
        })

}

export function trackEvents(event, meta = {}) {
    if (!cookieGet('s_a_js_uid')) {
        cookieSet('s_a_js_uid', uuidv4());
    }

    console.log(cookieGet('s_a_js_uid'));

    const clientId = window.sweep.sweepApiKey;

    if (!clientId) {
        throw new Error('No api key provided');
    }

    meta.path = document.location.pathname;

    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            operationName: 'trackEvent',
            query: trackEventMutation(),
            variables: {
                name: event,
                client: clientId,
                meta
            }
        })
    };

    fetch('https://api.sweep-analytics.com/public', options)
        .then((res) => {
            // console.log(res.json());
        })
        .catch((error) => {
            console.log(error);
        });

}
