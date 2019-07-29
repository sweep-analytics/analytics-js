import * as cookie from 'component-cookie';
import * as uuidv4 from 'uuid/v4';

export default function sweep(apiKey = '') {
    const clientId = apiKey;

    // Throw error if no api key is provided
    if (!clientId) {
        throw new Error('No api key provided');
    }

    /*
    * Mutations
    */

    // Track event
    const trackEventMutation = () => `mutation trackEvent($name: String!, $client: String!, $meta: JSON) {
          trackEvent(input: { name: $name, client: $client, meta: $meta }) { 
            name,
            client,
            meta
          }
        }`;

    /*
    * Functions
    */

    // Track page views
    function trackPageViews() {
        if (!cookie.cookie('s_a_js_uid')) {
            cookie.cookie('s_a_js_uid', uuidv4.uuidv4(), '');
        }

        const url = document.location.pathname;
        const referrer = document.referrer;
        const language = navigator.language;
        const platform = navigator.platform;
        const screen = `${screen.width}x${screen.height}`;

        const meta = {
            url,
            referrer,
            anonymousId: cookie.cookie('s_a_js_uid'),
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
                query: trackEventMutation(),
                variables: {
                    name: 'userSession',
                    client: clientId,
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
    function trackEvent(event, meta = {}) {
        if (!cookie.cookie('s_a_js_uid')) {
            cookie.cookie('s_a_js_uid', uuidv4.uuidv4(), '');
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

        fetch('https://api.sweep-analytics.com/graphql', options)
            .then((res) => {
                console.log(res.json());
            })
            .catch((error) => {
                console.log(error);
            });

    }

    // Track user flow
    // function trackUserFlow() {}

    // Track user flow
    // function trackUserDuration() {}
}
