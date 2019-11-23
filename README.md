# CPUMonitor

Small Project to monitor CPU usage

## Getting Started

First up lets get our backend up and running.

```
cd server
npm i
npm start
```

Next lets setup our frontend. (Make sure you're in the project's root directory)

```
cd app
npm i
npm start
```

Tada! Head over to your [localhost](http://localhost:3000/graphql) and enjoy the CPU monitoring!

## Improvements
Here are some possible improvements I would recommend implementing before this hit production.

1. Create a dashboard where users would be able to configure variables such as high threshold amount, high threshold duration, cooldown duration, refresh rate, etc.
2. Add more historical information such as average time CPU would spend in high load before recovering, how long it would take on average for the CPU to recover, etc.
3. Add ability to accept and show data from multiple hosts
4. Create a more holistic design
5. Verify if app meets a11y standards and if not adhere to those standards
6. Extract content to be provided by a CMS
