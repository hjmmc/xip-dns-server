#!/bin/sh

set -e

AXFR_IPS=${AXFR_IPS:-'127.0.0.0/8,::1'}
SQLITE_DATABASE=${SQLITE_DATABASE:-'/var/lib/powerdns/pdns.sqlite3'}
SOCKET_DIR=${SOCKET_DIR:-'/var/run'}
API_KEY=${API_KEY:-$(cat /dev/urandom | tr -dc "a-zA-Z0-9" | fold -w 16 | head -1)}
export AXFR_IPS SQLITE_DATABASE SOCKET_DIR API_KEY

test -f $SQLITE_DATABASE || \
  sqlite3 $SQLITE_DATABASE < /root/sqlite-init.sql

chown -R pdns $(dirname $SQLITE_DATABASE)

envsubst '$AXFR_IPS $SQLITE_DATABASE $SOCKET_DIR $API_KEY' < /etc/pdns/pdns.conf.tpl > /etc/pdns/pdns.conf

/usr/local/sbin/pdns_server $@
