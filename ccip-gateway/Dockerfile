# Base image
FROM node:20

WORKDIR /usr/src/app

COPY node_modules/ node_modules/
COPY dist/ dist/

EXPOSE 3000

CMD ["node", "dist/main.js"]