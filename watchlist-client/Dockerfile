FROM node:20
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .

ENTRYPOINT ["npm"]
CMD ["start"]


