import uuidv4 from "@bundled-es-modules/uuid/v4.js";
import cookie from './cookies';

export default class Sweep {

    constructor(apiKey) {
        this.clientId = apiKey;

        this.trackEventMutation = () => `mutation trackEvent($name: String!, $client: String!, $meta: JSON) {
          trackEvent(input: { name: $name, client: $client, meta: $meta }) { 
            name,
            client,
            meta
          }
        }`;
    }

    /*
    * Functions
    */

    // Track page views
    trackPageViews() {
        if (!cookie.get('s_a_js_uid')) {
            cookie.set('s_a_js_uid', uuidv4());
        }

        const url = document.location.pathname;
        const referrer = document.referrer;
        const language = navigator.language;
        const platform = navigator.platform;
        const screen = `${screen.width}x${screen.height}`;

        const meta = {
            url,
            referrer,
            anonymousId: cookie.get('s_a_js_uid'),
            language,
            platform,
            screen
        };

        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operationName: 'trackEvent',
                query: this.trackEventMutation(),
                variables: {
                    name: 'userSession',
                    client: this.clientId,
                    meta
                }
            })
        };

        fetch(`https://api.sweep-analytics.com/graphql`, options)
            .then((res) => {
                console.log(res.json());
            })
            .catch((err) => {
                console.log(err);
            })

    }

    // Track events
    trackEvent(event, meta = {}) {
        if (!cookie.get('s_a_js_uid')) {
            cookie.set('s_a_js_uid', uuidv4());
        }

        meta.path = document.location.pathname;

        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operationName: 'trackEvent',
                query: this.trackEventMutation(),
                variables: {
                    name: event,
                    client: this.clientId,
                    meta
                }
            })
        };

        fetch('https://api.sweep-analytics.com/graphql', options)
            .then((res) => {
                console.log(res.json());
            })
            .catch((error) => {
                console.log(error);
            });

    }

    // Track user flow
    // trackUserFlow() {}

    // Track user flow
    // trackUserDuration() {}
}
