const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

dns.resolveSrv(
    '_mongodb._tcp.cluster0.vzjsjdw.mongodb.net',
    (err, records) => {
        console.log('ERROR:', err);
        console.log('RECORDS:', records);
    }
);