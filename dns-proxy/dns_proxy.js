const dgram = require('dgram')
const server = dgram.createSocket('udp4')

const Packet = require('./native-dns-packet')

const DNS_SEV = process.env.DNS_SEV || '127.0.0.1'
const DNS_PORT = process.env.DNS_PORT || 53

console.log('DNS:', DNS_SEV, DNS_PORT)

const ipReg = /(\d{1,3})[\.-](\d{1,3})[\.-](\d{1,3})[\.-](\d{1,3})/

function proxy(buffer, req, rinfo) {
	console.log('req', buffer.toString('hex'))
	console.log('req', JSON.stringify(req))
	const client = dgram.createSocket('udp4');

	client.on('error', (err) => {
		console.log(`client error:` + err.stack)
		client.close();
	})
	client.on('message', (resBuf, fbRinfo) => {
		console.log("res", resBuf.toString('hex')); //获取响应报文
		let res = Packet.parse(resBuf)
		console.log('res', JSON.stringify(res))
		server.send(resBuf, rinfo.port, rinfo.address, (err) => {
			err && console.log(err);
		});
		client.close();
	})

	client.send(buffer, DNS_PORT, DNS_SEV, (err) => {
		if (err) {
			console.log(err);
			client.close();
		}
	});
}

server.on('message', (buffer, rinfo) => {
	let req = Packet.parse(buffer)
	if (req.question.length == 1) {
		let q = req.question[0]
		if (q.type == 1 && ipReg.test(q.name)) {
			req.header.qr = 1
			req.header.ra = 1
			req.answer = [{
				"name": q.name,
				"type": 1,
				"class": 1,
				"ttl": 3600,
				"address": ipReg.exec(q.name).slice(1).join('.')
			}]
			let buf = Buffer.allocUnsafe(2048)
			let len = Packet.write(buf, req)
			let resBuf = buf.slice(0, len)

			console.log("res1", resBuf.toString('hex')); //获取响应报文
			console.log('res1', JSON.stringify(req))
			console.log('res1', ipReg.exec(q.name).slice(1).join('.'))
			server.send(resBuf, rinfo.port, rinfo.address, (err) => {
				err && console.log(err);
			})
			return
		}
	}
	proxy(buffer, req, rinfo); //转发
})

server.on('error', (err) => {
	console.log('server error:' + err.stack)
	server.close()
})
server.on('listening', () => {
	const addr = server.address()
	console.log(`run ${addr.address}:${addr.port}`)
})
server.bind(53);