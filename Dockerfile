FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY tsconfig.json tsconfig.json
COPY jest.config.ts jest.config.ts
COPY tslint.json tslint.json
COPY .swcrc .swcrc

COPY src ./src

CMD ["npm", "test"]
