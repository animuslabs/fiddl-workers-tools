# fiddl-workers-tools
## First
Install new worker with repo: https://github.com/Haidra-Org/horde-worker-reGen

look at default settings example on bridgeData-example.yaml file and use that for the horde-worker


look at the bridgeData_template.yaml file in the horde repo for other settings options  
It's an example for a machine with 10GB GPU

# Tools install
```
yarn install
```

```
cp example.config.json config.json
```
Parameters:
```
    "mainUserKey": "XXX", (main user api key that deals with all the queries in the horde)
    "workerKey": "XXX", (worker api key)
    "apiUrl": "https://aihorde.net/api/v2", (horde url, for FiddlArt it will be different)
    "client_agent_name": "Boid:v0.0.1:Seth", (your client version)
    "telegram_bot_token": "XXX:XXX" (token for the telegram bot)
    "telegram_chat_id": "your_chat_id_here", (where errors will be sent to on telegram)
    "check_workers": true, (do you want to run check workers script or not)
    "check_workers_interval": 1800000, (how often do you want to run check workers script)
    "report_telegram": true, (do you want to send reports to telegram)
    "report_mail": false, (do you want to send reports to email)
    "reply_email": "" (email address that report will be sent to)
    "service": "gmail", (its a preconfigured option available in nodemailer)
    "service_active": true, (use preconfigured nodemailer option or set to false to use custom host)
    "host": The SMTP server host (e.g., smtp.gmail.com for Gmail).
    "port": The port to connect to. Common ports:
    465 for secure (SSL) connections.
    587 for secure (TLS) connections.
    "secure": true if using port 465, false otherwise.
    "auth.user": Your SMTP username (often your email address).
    "auth.pass": Your SMTP password or app-specific password.
```

Then you can just run by:
```
yarn build

node dist/index.js 
```

## IMAGE GENERATION
in lib/imageGen.ts file there is a script example on how to generate an image and get the img url (generateAndRetrieveImage function)
