sweep analytics js
=====
Easy, small, developer and privacy-friendly analytics service.

Installation
------------
For installation, just add our javascript tracking snippet at the ```<head>``` of your page and set your API Key.

```bash
<script src="https://unpkg.com/@sweep/analytics-js@0.1.0/dist/sweep.min.js" key="[YOUR_API_KEY]" logs="[true/false]" noCookie="[true/false]" type="application/javascript"></script
```

Usage
-----
Add your API Key to the ```[key]``` attribute.

To disable cookie usage set the ```[noCookie]``` attribute to ```true```, if is set to ```true``` no unique user tracking is enabled.

To enable error logging set the ```[logs]``` attribute to ```true```.

To track events like button clicks add the ```data-sweep-click="[TRACKING_VALUE]"``` attribute to the element.

Replace ```[TRACKING_VALUE]``` with your tracking values.
You can send multiple comma separated values.

What do we track
-----

#### NO ip address
We do not track, send or log the io address of the user.

#### Page views
- url
- referrer,
- language,
- platform,
- user agent
- screensize

For authentication of unique users we use ad random generated anonymous id. This UUID is stored in a cookie. To disable cookie usage set the ```[noCookie]``` attribute to ```false```.

#### Events
- event name
- path
- meta

What meta data is logged is complete up to you, just add comma separated values to the ```data-sweep-click="[TRACKING_VALUE]"``` attribute.

#### Logs
Coming soon!


Contributors
---------
<table>
  <tr>
    <td align="center">
    <a href="https://github.com/regnerisch">
	    <img src="https://avatars1.githubusercontent.com/u/9422737?s=460&v=4" width="100px;" alt="Jonas Regner"/>
	    <br /><sub><b>Jonas Regner</b></sub>
    </a>
    </td>
    <td align="center">
    <a href="https://github.com/bentzibentz">
    <img src="https://avatars0.githubusercontent.com/u/8548959?s=460&v=4" width="100px;" alt="Fabian Bentz"/>
    <br /><sub><b>Fabian Bentz</b></sub>
    </a>
    </td>
</tr>
</table>

License
-------

Copyright (c) 2019 sweep analytics.
Released under the [MIT](LICENSE) license.

