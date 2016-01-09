require('shelljs/global');
require('./server/shared')()
var fs = require('fs');

var moment = require('moment');
var dateFormat = moment().format('YYYY-MM-DD--HH[h]mm');
var dumpPath = process.cwd() + '/dump-' + dateFormat;
var fileName = 'EDISON-BACKUP-' + dateFormat;
var dbName = '/' + dumpPath + '/' + fileName
var archivePath = dumpPath + '.tar.gz';
var archiveName = fileName + '.tar.gz';


rm('-fr', "./dump")
exec('mongodump -d EDISON --excludeCollectionsWithPrefix=event');

rm(dumpPath)
mv('./dump', dumpPath)

mv(dumpPath + '/EDISON', dbName);

exec(['tar', '-zcvf', archivePath, dumpPath].join(' '))
//exec(['mongorestore', dumpPath].join(' '))

document.upload({
		data: fs.readFileSync(archivePath),
		filename: '/DB-BACKUP/' + archiveName
	})
	.then(function(resp) {
		console.log('[OK]', resp)
		exit()

	}, function(err) {
		console.log('[ERR]', err);
		exit();
	})
