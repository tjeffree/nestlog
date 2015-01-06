# NestLog

Simple Node.js application for collecting Nest data (current temperature, target and humidity) and displaying it in a graph.

Built for Heroku deployment.

---

Some environment variables are required. For Heroku use the following syntax:

```
heroku config:set VAR_NAME=VALUE
```
List of variables:
```
MongoDBURI:              <user>:<pass>@<mongodb-url>
NEWRELIC_KEY:            <key>
NEW_RELIC_LICENSE_KEY:   <key>
NEW_RELIC_LOG:           stdout
googleAuth.clientID:     <Google clientID>
googleAuth.clientSecret: <Google secret>
nestAuth.clientID:       <Nest clientID>
nestAuth.clientSecret:   <Nest secret>
```
