# Xip Dns Server

[https://xip.lhjmmc.cn](https://xip.lhjmmc.cn)

## Require

- docker
- docker-compose
- acme.sh

## Useage

1. set a NS record to your domain (such as `xip.lhjmmc.cn`)

```
    ...
    NS      xip.lhjmmc.cn       your_server_domain(origin.lhjmmc.cn)
    ...
```

2. deploy

```bash
## clone
git clone https://github.com/hjmmc/xip-dns-server.git
cd xip-dns-server

## docker-compose
docker-compose up -d
```

check nsedit is success running [http://your_server_ip:5380](http://your_server_ip:5380) default user is admin/admin

add your zone in powerdns by nsedit or curl

```bash
curl -X POST --data '{"name":"xip.lhjmmc.cn.", "kind": "Native", "masters": [], "nameservers": ["ns1.xip.lhjmmc.cn.", "ns2.xip.lhjmmc.cn."]}' -v -H 'X-API-Key: 123456' http://localhost:5381/api/v1/servers/localhost/zones
```

add some A record for your domain

```
    A    xip.lhjmmc.cn     your_server_ip
    A    *.xip.lhjmmc.cn   your_server_ip
```

check dns server by nslookup

```bash
nslookup xip.lhjmmc.cn
nslookup 192-168-1-1.xip.lhjmmc.cn
```

3. generate certs

```bash
## http://acme.sh/
export PDNS_Url="http://localhost:5381"
export PDNS_ServerId="localhost"
export PDNS_Token="123456"
export PDNS_Ttl=60
acme.sh --issue --dns dns_pdns -d xip.lhjmmc.cn -d *.xip.lhjmmc.cn

## install-cert
mkdir /var/www/html/xip.lhjmmc.cn
acme.sh --install-cert -d xip.lhjmmc.cn --cert-file  /var/www/html/xip.lhjmmc.cn/cert.pem  --key-file  /var/www/html/xip.lhjmmc.cn/key.pem  --fullchain-file /var/www/html/xip
.lhjmmc.cn/fullchain.pem --reloadcmd "chmod 777 /var/www/html/xip.lhjmmc.cn/*" 
```

4. Share cert by nginx conf

```
server {
    listen       80;
    listen       443 ssl;
    server_name  xip.lhjmmc.cn;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    #SSL Support
    ssl_certificate /var/www/html/xip.lhjmmc.cn/fullchain.pem;
    ssl_certificate_key /var/www/html/xip.lhjmmc.cn/key.pem;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULLL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        root   /var/www/html/xip.lhjmmc.cn;
        index  index.html index.htm;
    }
}
```

## Thanks

[Mikroways/docker-powerdns](https://github.com/Mikroways/docker-powerdns)

[techguy613/native-dns-packet](https://github.com/techguy613/native-dns-packet)

[acme.sh](https://acme.sh)


## Donate

> If you find this project useful, you can buy author a glass of juice 🍹

<details>
  <summary>Alipay & Wechat</summary>
    
  <img src="https://cdn.lhjmmc.cn/alipay.jpg" width="300px"  />
  <img src="https://cdn.lhjmmc.cn/wx.jpg" width="350px" />
</details>
