# fiddl-workers-tools
## First
Install new worker with repo: https://github.com/Haidra-Org/horde-worker-reGen

default settings example on bridgeData.yaml file:
```
# The horde url (this may change, ask in our TG channel)
horde_url: "https://aihorde.net"

# API key for your workers
api_key: "XXX"

priority_usernames: []
max_threads: 1
queue_size: 1
max_batch: 1
safety_on_gpu: true
require_upfront_kudos: true

# The worker name to use when running a dreamer instance.
dreamer_name: "Boid-Worker-1"

max_power: 128
blacklist: []
nsfw: true
censor_nsfw: false
censorlist: []
allow_img2img: true
allow_painting: true
allow_unsafe_ip: true
allow_post_processing: true
allow_controlnet: true
allow_sdxl_controlnet: false
allow_lora: false
max_lora_cache_size: 100
dynamic_models: false # Currently unused in reGen
number_of_dynamic_models: 0 # Currently unused in reGen
max_models_to_download: 10 # Currently unused in reGen
stats_output_frequency: 30

cache_home: "./models/"
temp_dir: "./tmp" # Currently unused in reGen

always_download: true # Currently unused in reGen
disable_terminal_ui: false # Currently unused in reGen
vram_to_leave_free: "80%" # Currently unused in reGen
ram_to_leave_free: "80%" # Currently unused in reGen

# Obsolete
disable_disk_cache: false # Currently unused in reGen

# The models to use.
models_to_load:
  - "ALL SFW"
  - "stable_diffusion_2.1"
  - "stable_diffusion"

models_to_skip:
  - "pix2pix" # Not currently supported
  - "SDXL_beta::stability.ai#6901" # Do not remove this, as this model would never work
  - A to Zovya RPG # This model is known to cause problems with reGen

suppress_speed_warnings: false # Currently unused in reGen

# The worker name to use when running a scribe worker.
scribe_name: "Boid-Worker-1"

# The KoboldAI Client API URL
kai_url: "http://localhost:5000"

max_length: 160
max_context_length: 1024
branded_model: true

# The name to use when running an alchemist worker.
alchemist_name: "Boid-Worker-1"

forms:
  - "caption"
  - "nsfw" # uses CPU
  - "interrogation"
  - "post-process"

```

look at the bridgeData_template.yaml file in the horde repo for other settings options

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
```

Then you can just run by:
```
yarn build

node dist/index.js 
```

## TO DO
- check if workers are in maintenance mode and if so, set them to active on a schedule
- setup a check for workers if they are active or not
- image generation example script
- sending email using nodemailer with errors