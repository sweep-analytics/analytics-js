import uuidv4 from "@bundled-es-modules/uuid/v4.js";
import { cookieSet, cookieGet } from './cookies';

export default class Sweep {

    constructor(apiKey, logs, noCookie) {
        window.sweep = {
            sweepApiKey: apiKey,
            sweepLogs: logs,
            sweepNoCookie: noCookie
        };
    }

    // Track user flow
    // trackUserFlow() {}

    // Track user flow
    // trackUserDuration() {}

}

const trackEventMutation = () => `mutation trackEvent($type: EventType!, $name: String!, $client: String!, $meta: JSON) {
  trackEvent(type: $type, input: { name: $name, client: $client, meta: $meta }) { 
    name,
    client,
    meta
  }
}`;

export function trackPageViews() {

    const noCookie = window.sweep.sweepNoCookie;

    if ('true' !== noCookie && !cookieGet('s_a_js_uid')) {
        cookieSet('s_a_js_uid', uuidv4());
    }

    try {

        const clientId = window.sweep.sweepApiKey;

        // break if no api key provided
        if (!clientId) {
            throw new Error('No api key provided');
        }

        const nav = window.navigator;

        const loc = window.location;
        const userAgent = nav.userAgent;

        // return if user agent is bot
        if (userAgent.search(/(bot|spider|crawl)/ig) > -1) {
            throw new Error('bot… not tracked');
        }

        let previousUrl = '';

        // generate meta data
        let url;
        if (!loc.hash) {
            url = loc.protocol + '//' + loc.hostname + loc.pathname;
        } else {
            url = loc.protocol + '//' + loc.hostname + loc.pathname + loc.hash;
        }
        const referrer = document.referrer;
        const language = navigator.language;
        const platform = navigator.platform;
        const size = `${window.screen.width}x${window.screen.height}`;

        // build meta data object
        const meta = {
            url,
            referrer,
            language,
            platform,
            userAgent,
            screen: size
        };

        // use cookie only if not disabled
        if ('true' !== noCookie) {
            meta.anonymousId = cookieGet('s_a_js_uid');
        }

        // build request
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operationName: 'trackEvent',
                query: trackEventMutation(),
                variables: {
                    type: 'ANALYSIS',
                    name: 'userSession',
                    client: clientId,
                    meta
                }
            })
        };

        // break if tried to send previews url again
        if (previousUrl === url) {
            return
        };
        previousUrl = url;

        // fetch request
        fetch(`https://api.sweep-analytics.com/public`, options)
        .then(() => {
            console.log('send');
        })
        .catch((err) => {
            throw new Error(err);
        });

    } catch(e) {
        console.error(e);
    }

}

export function trackEvents(event, meta = {}) {

    try {

        const clientId = window.sweep.sweepApiKey;

        // break if no api key provided
        if (!clientId) {
            throw new Error('No api key provided');
        }

        const nav = window.navigator;

        const loc = window.location;
        const userAgent = nav.userAgent;

        // return if user agent is bot
        if (userAgent.search(/(bot|spider|crawl)/ig) > -1) {
            throw new Error('bot… not tracked');
        }

        // pass pathname to meta data
        meta.path = loc.pathname;

        // build request
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operationName: 'trackEvent',
                query: trackEventMutation(),
                variables: {
                    type: 'ANALYSIS',
                    name: event,
                    client: clientId,
                    meta
                }
            })
        };

        // fetch request
        fetch('https://api.sweep-analytics.com/public', options)
        .then(() => {
            console.log('send event');
        })
        .catch((error) => {
            throw new Error(error);
        });

    } catch(e) {
        console.error(e);
    }

}

export function trackErrors() {

    try {

        const enableLogs = window.sweep.logs;

        if ('true' !== enableLogs || !enableLogs) {
            return;
        }

        const clientId = window.sweep.sweepApiKey;

        if (!clientId) {
            throw new Error('No api key provided');
        }

        const nav = window.navigator;

        const loc = window.location;
        const userAgent = nav.userAgent;

        // return if user agent is bot
        if (userAgent.search(/(bot|spider|crawl)/ig) > -1) {
            throw new Error('bot… not tracked');
        }

        let previousUrl = '';

        // generate meta data
        let url;
        if (!loc.hash) {
            url = loc.protocol + '//' + loc.hostname + loc.pathname;
        } else {
            url = loc.protocol + '//' + loc.hostname + loc.pathname + loc.hash;
        }
        const referrer = document.referrer;
        const language = navigator.language;
        const platform = navigator.platform;
        const size = `${window.screen.width}x${window.screen.height}`;

        // build meta data object
        const meta = {
            url,
            referrer,
            language,
            platform,
            userAgent,
            screen: size
        };

        window.addEventListener('error', (event) => {

            const log = {
                line: event.lineno,
                filename: event.filename,
                message: event.message,
                error: event.error
            };

            meta.log = log;

            // build request
            const options = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    operationName: 'trackEvent',
                    query: trackEventMutation(),
                    variables: {
                        type: 'LOG',
                        name: event,
                        client: clientId,
                        meta
                    }
                })
            };

            // fetch request
            fetch('https://api.sweep-analytics.com/public', options)
            .then(() => {
                console.log('send event');
            })
            .catch((error) => {
                throw new Error(error);
            });
        });

    } catch (e) {
        console.error(e);
    }


}
