const fs = require('fs')
const request = require('request')
const config = require('./config.js')
const	path = require('path')

fs.mkdirSync(config.pathToFolder, {recursive: true})


function startLoop (count, config, callback) {
    if (count === config.sumFile+1) {
        callback()
    } else {
        sendRequest(count, config, (count, config) => {
            startLoop(count, config, callback);
        })
    }
}
function sendRequest(count, config, callback) {
	const url = config.url.base + config.url.changeSection[0] + count + config.url.changeSection[1]
	request.get(url)
		.pipe(fs.createWriteStream(path.resolve(config.pathToFolder, config.fileName + count + config.url.changeSection[1])))
		.on('finish', function() {
			console.log(`Файл ${config.url.changeSection[0] + count + config.url.changeSection[1]} скачан`)
			count++
			callback(count, config)
		});
}


startLoop(1, config, () =>{
	console.log("Все записано")
})
