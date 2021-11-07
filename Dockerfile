FROM node:lts-alpine AS build
WORKDIR /app
COPY ["package.json","./"]

RUN npm i

COPY . .

FROM build AS test
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["npm", "test"]