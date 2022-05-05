## Description


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API

```bash
# Starting a block scan
POST http://127.0.0.1:3000/indexes-blocks 
Body:
startBlock: number; [optional]
endBlock: number; [optional]

```