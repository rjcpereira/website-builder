# WebsiteBuilder

Static website builder with realtime changes.

Build __SCSS__ and __JS__ from different directories into 2 __CSS__ and __JS__ bundles (_main_ and _site_ specific files).

## Requirements

- Node 16 [download](https://nodejs.org/en/download/);

### Other Usefull Stuff

- VSCode [download](https://code.visualstudio.com/download);
- Docker [download](https://www.docker.com/products/docker-desktop);

## Initial config

`npm i`

### Recomended

`npm i -g npx gulp-cli nuxt sass node-sass`

_Admin permissions may be required_

## Develompent

Wacth on: [http://localhost:3000/](http://localhost:3000/).

Open another tab/window and go to [http://localhost:3000/api/dev](http://localhost:3000/api/dev) to update results in realtime, give it some refreshes...

### NodeJS

`npm run dev`

_This will recompile the project on file changes_

### Docker (docker-compose)

`npm run compose` or `docker-compose up --build`

## Build

#### NodeJS

`npm run build`

#### Docker

`npm run docker`;

## Start

#### NodeJS

`npm run server` or `node server`

#### Docker

`npm run docker:start`

## Build & Start

#### NodeJS

`npm run start`

#### Docker

`npm run dockerize`

## TODO

- form & fields components
- widgets builder
- analytics
- pub

#### Next

- hot reloader (development)
- router (reactive)
- mongodb connector