FROM node:18

WORKDIR /app

COPY . /app/

RUN npm ci --quiet

RUN npm run build

RUN npm install -g nodemon

CMD ["bash", "boot_node.sh"]
