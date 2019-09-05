FROM tcely/powerdns-server

RUN apk add -U sqlite gettext

ADD ./pdns.conf /etc/pdns/pdns.conf.tpl
ADD ./sqlite-init.sql /root/sqlite-init.sql
ADD ./entrypoint.sh /entrypoint.sh

ENV API_KEY 123456

ENTRYPOINT ["/entrypoint.sh" ]

CMD ["--disable-syslog=yes"]

EXPOSE 8081 53 53/udp

