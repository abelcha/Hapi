require('shelljs/global');
require('./server/shared')()
var colors = require('colors');
var fs = require('fs');

var moment = require('moment');
var dateFormat = moment().format('YYYY-MM-DD--HH[h]mm');
var dumpPath = process.cwd() + '/dump-' + dateFormat;
var fileName = 'EDISON-BACKUP-' + dateFormat;
var dbName = '/' + dumpPath + '/' + fileName
var archivePath = dumpPath + '.tar.gz';
var archiveName = fileName + '.tar.gz';


console.log('rm', '-fr', "./dump")
rm('-fr', "./dump")

console.log('mongodump -d EDISON --excludeCollectionsWithPrefix=event')
exec('mongodump -d EDISON --excludeCollectionsWithPrefix=event');

console.log('rm', dumpPath)
rm(dumpPath)

console.log('./dump', dumpPath)
mv('./dump', dumpPath)

console.log('mv', dumpPath + '/EDISON', dbName)
mv(dumpPath + '/EDISON', dbName);

console.log('exec', ['tar', '-zcvf', archivePath, dumpPath].join(' '))
exec(['tar', '-zcvf', archivePath, dumpPath].join(' '))
exec(['mongorestore', dumpPath].join(' '))

console.log('UPLOAD...')
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
