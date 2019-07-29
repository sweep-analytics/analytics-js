import cookie from 'component-cookie';
import uuidv4 from 'uuid/v4';

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
    const trackEventMutation = () => `mutation trackEvent($client: String!, $meta: JSON) {
          trackEvent(input: { name:"userSession", client: $client, meta: $meta }) { 
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
        if (!cookie('s_a_js_uid')) {
            cookie('s_a_js_uid', uuidv4(), '');
        }

        const url = document.location.pathname;
        const referrer = document.referrer;
        const language = navigator.language;
        const platform = navigator.platform;
        const screen = `${screen.width}x${screen.height}`;

        const meta = {
            url: url,
            referrer: referrer,
            anonymousId: cookie('s_a_js_uid'),
            language: language,
            platform: platform,
            screen: screen
        };

        const options = {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                operationName: "trackEvent",
                query: trackEventMutation(),
                variables: {
                    client: clientId,
                    meta: meta
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
    function trackEvent(meta = {}) {
        if (!cookie('s_a_js_uid')) {
            cookie('s_a_js_uid', uuidv4(), '');
        }

        // TODO add track event function


    }

    // Track user flow
    function trackUserFlow() {}

}
