
FROM node:20-alpine AS build


WORKDIR /app


COPY package.json package-lock.json ./
RUN npm install


COPY . .


RUN npm run build -- --configuration production


FROM nginx:stable-alpine


RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=build /app/dist/biscoitos-bom-chefe /usr/share/nginx/html


EXPOSE 80
