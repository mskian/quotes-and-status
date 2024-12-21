# 🥤 Status Updates  

![build-test](https://github.com/mskian/quotes-and-status/workflows/build-test/badge.svg)  

Share your thoughts: Simply type and post your status updates.  

**Note**  

I primarily built this tool for personal use, and I mostly run it on my home server or localhost.This tool is not recommended for production use, as it lacks additional security layers such as header authentication, API keys, or token methods to prevent unauthorized access. However, you are welcome to fork the project and make any changes as needed.  

## Setup

- Download or Clone the repo
- install dependencies

```sh
pnpm install
```

- Development

```sh
pnpm dev
```

- Build a Project

```sh
pnpm build
```

- Start the server

```sh
pnpm start
```

## Routes

- `/` - Static Home Page for add status, get status by id and get all status
- `/api/status` - API for all operations  

## Database

- Create Folder Named `data` and create a JSON file to store the status Content

```sh
mkdir -p data
touch status.json
```

- Add Square brackets to the JSON File

```json
[]
```

- Done

## API Usage

- Add status

```sh
curl -X POST -H "Content-Type: application/json" -d '{"text": "Hello World"}' http://localhost:6027/api/status
```

- Trigger URL to watch the content update

```sh
curl http://localhost:6027/api/status/1 // ID Number
```

- get all status

```sh
curl http://localhost:6027/api/status
```

## LICENSE

MIT
