FROM node:20 as build

WORKDIR /crm-ui

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /crm-ui/build /usr/share/nginx/html

# Copy the custom Nginx configuration file from the public folder
COPY public/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]