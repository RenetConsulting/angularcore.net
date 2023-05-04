import { IHitType } from './hit.type';

/** descriptions of keys see in the https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters */
export class TrackerModel {

    /**
     * Protocol Version
     * Required for all hit types.
     * The Protocol version. The current value is "1".
     * This will only change when there are changes made that are not backwards compatible.
     */
    v = '2';

    /**
     * Campaign Medium
     * Optional.
     * Specifies the campaign medium.
     */
    cm?: string = null;

    /**
     * Campaign Source
     * Optional.
     * Specifies the campaign source.
     */
    cs?: string = null;

    /**
     * Client ID
     * Optional.
     * This field is required if User ID (uid) is not specified in the request.
     * This anonymously identifies a particular user, device, or browser instance.
     * For the web, this is generally stored as a first-party cookie with a two-year expiration.
     * For mobile apps, this is randomly generated for each particular instance of an application install.
     * The value of this field should be a random UUID (version 4) as described in http://www.ietf.org/rfc/rfc4122.txt.
     */
    cid?: string = null;

    /**
     * Document Encoding
     * Optional.
     * Specifies the character set used to encode the page / document.
     */
    de?: string = null;

    /**
     * Event Action
     * Required for event hit type.
     * Specifies the event action. Must not be empty.
     */
    ea?: string = null;

    /**
     * Event Category
     * Required for event hit type.
     * Specifies the event category. Must not be empty.
     */
    ec?: string = null;

    /**
     * Event Value
     * Optional.
     * Specifies the event value. Values must be non-negative.
     */
    ev?: number = null;

    /**
     * Event Label
     * Optional.
     * Specifies the event label.
     */
    el?: string = null;

    /**
     * Hit type
     * Required for all hit types.
     * The type of hit. Must be one of "pageview", "screenview", "event", "transaction", "item", "social", "exception", "timing".
     */
    en?: keyof IHitType = 'pageview';

    /**
     * Java Enabled
     * Optional.
     * Specifies whether Java was enabled.
     */
    je = '0';

    /**
     * User Language
     * Optional.
     * Specifies the language.
     */
    ul?: string = null;

    /**
     * Document location URL
     * Optional.
     * Use this parameter to send the full URL (document location) of the page on which content resides.
     * You can use the &dh and &dp parameters to override the hostname and path + query portions of the document location, accordingly.
     * The JavaScript clients determine this parameter using the concatenation of
     * the document.location.origin + document.location.pathname + document.location.search browser parameters.
     * Be sure to remove any user authentication or other private information from the URL if present.
     * For "pageview" hits, either &dl or both &dh and &dp have to be specified for the hit to be valid.
     */
    dl?: string = null;

    /**
     * Document Path
     * Optional.
     * The path portion of the page URL. Should begin with "/".
     * For "pageview" hits, either &dl or both &dh and &dp have to be specified for the hit to be valid.
     */
    dp?: string = null;

    /**
     * Document Referrer
     * Optional.
     * Specifies which referral source brought traffic to a website.
     * This value is also used to compute the traffic source.
     * The format of this value is a URL.
     */
    dr?: string = null;

    /**
     * Screen Colors
     * Optional.
     * Specifies the screen color depth.
     */
    sd?: string = null;

    /**
     * Screen Resolution
     * Optional.
     * Specifies the screen resolution.
     */
    sr?: string = null;

    /**
     * Document Title
     * Optional.
     * The title of the page / document.
     */
    dt?: string = null;

    /**
     * Tracking ID / Web Property ID
     * Required for all hit types.
     * The tracking ID / web property ID. The format is UA-XXXX-Y. All collected data is associated by this ID.
     */
    tid: string = null; // the value will set in the back-end side (like UA-XXXXXXXX-X)

    /**
     * Viewport size
     * Optional.
     * Specifies the viewable area of the browser / device.
     */
    vp?: string = null;

    /**
     * Cache Buster
     * Optional.
     * Used to send a random number in GET requests to ensure browsers and proxies don"t cache hits.
     * It should be sent as the final parameter of the request since we"ve seen some 3rd party internet filtering software add
     * additional parameters to HTTP requests incorrectly.
     * This value is not used in reporting.
     */
    z?: string = null;

    /**
     * Session Control
     * Optional.
     * Used to control the session duration.
     * A value of "start" forces a new session to start with this hit and "end" forces the current session to end with this hit.
     * All other values are ignored.
     */
    sc?: string = null;

    constructor() { }
}
