FROM node:10

RUN mkdir -p /home/dns-proxy
WORKDIR /home/dns-proxy
COPY . /home/dns-proxy

ENV DNS_SEV 127.0.0.1
ENV DNS_PORT 53

RUN npm install

EXPOSE 53/udp

CMD [ "npm", "start" ]