FROM shinchven/node:20-deployment

# install dependencies for chrome and puppeteer
RUN apt update && apt install -y \
ca-certificates \
fonts-liberation \
libasound2 \
libatk-bridge2.0-0 \
libatk1.0-0 \
libc6 \
libcairo2 \
libcups2 \
libdbus-1-3 \
libexpat1 \
libfontconfig1 \
libgbm1 \
libgcc1 \
libglib2.0-0 \
libgtk-3-0 \
libnspr4 \
libnss3 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libstdc++6 \
libx11-6 \
libx11-xcb1 \
libxcb1 \
libxcomposite1 \
libxcursor1 \
libxdamage1 \
libxext6 \
libxfixes3 \
libxi6 \
libxrandr2 \
libxrender1 \
libxss1 \
libxtst6 \
lsb-release \
wget \
xdg-utils \
curl

# install google-chrome-stable
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb

# copy files
WORKDIR /usr/src/app
COPY server /usr/src/app
COPY fonts/MSYH.ttc /usr/share/fonts/

# build app
RUN npm install && npm run compile

ENV NODE_ENV=production

EXPOSE 3030

CMD ["node","lib/index.js"]
