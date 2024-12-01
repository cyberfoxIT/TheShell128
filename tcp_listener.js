const net = require('net');
const path = require('path');
const fsp = require('fs').promises;
const fs = require('fs');
const args = process.argv;

let PORT = 3000;

if (args.length > 2) {
    PORT = args[2];
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function padNumberWithSpaces(number, totalLength) {

    let numberString = number.toString();
    let paddingLength = totalLength - numberString.length;
    let paddedNumber = numberString.padStart(totalLength, ' ');
    
    return paddedNumber;
}

function getIPv4MappedAddress(address) {
    if (address.startsWith('::ffff:')) {
        return address.replace('::ffff:', '');
    }
    return address;
}

async function readDirectoryAndSend(directoryPath, socket) {
    var d = new Date,
        now = [(d.getMonth() + 1).toString().padStart(2, '0'),
               d.getDate().toString().padStart(2, '0'),
               d.getFullYear()].join('/') + ' ' +
              [d.getHours().toString().padStart(2, '0'),
               d.getMinutes().toString().padStart(2, '0'),
               d.getSeconds().toString().padStart(2, '0')].join(':');
    try {
        const resolvedPath = path.resolve(directoryPath);
        const entries = await fsp.readdir(resolvedPath, { withFileTypes: true });

        const directories = entries.filter(entry => entry.isDirectory());
        const files = entries.filter(entry => entry.isFile());

        directories.sort((a, b) => a.name.localeCompare(b.name));
        files.sort((a, b) => a.name.localeCompare(b.name));

        const sortedEntries = [...directories, ...files];

        for (const entry of sortedEntries) {
            const entryPath = path.join(resolvedPath, entry.name);
            if (entry.isFile()) {
                socket.write(`      ${entryPath}\r`.replace(/\\/g, '/').toLowerCase());
            } else if (entry.isDirectory()) {
                socket.write(`<DIR> ${entryPath}\r`.replace(/\\/g, '/').toLowerCase());
            }
        }
        console.log(now + ' ' + getIPv4MappedAddress(socket.remoteAddress) + '                want to see dir ' + path.resolve(directoryPath));
    } catch (err) {
        console.log(now + ' ' + getIPv4MappedAddress(socket.remoteAddress) + ' ERR            want to see dir ' + directoryPath);
    }
}

const server = net.createServer((socket) => {
    
	const clientAddress = getIPv4MappedAddress(socket.remoteAddress);
	socket.setEncoding('utf8');

	let fileName = '';
	socket.on('data', (data) => {
		const receivedMessage = data.toString();
		if (receivedMessage.toUpperCase().startsWith("GET")){
			try{
				var d = new Date,
					now = [(d.getMonth()+1).padLeft(),
						  d.getDate().padLeft(),
						  d.getFullYear()].join('/') +' ' +
						  [d.getHours().padLeft(),
						  d.getMinutes().padLeft(),
						  d.getSeconds().padLeft()].join(':');
			   
				fileName = receivedMessage.substring(4).replace(/\//g, '\\');
				fs.readFile(fileName, (err, fileContent) => {
					if (err) {
						console.log(now + ' ' + clientAddress + ' ERR            want to get file ' + fileName);
					} else {
						socket.write(fileContent, () => {
							console.log(now + ' ' + clientAddress + '     ' + padNumberWithSpaces(fileContent.length, 10) + ' want to get file ' + fileName);
						});				
					}
				});
			} catch (error){
				console.log(now + ' ' + clientAddress + ' ERR            want to get file ' + fileName);
			}
		} else if (receivedMessage.toUpperCase().startsWith("DIR")){
			try{
				var d = new Date,
					now = [(d.getMonth()+1).padLeft(),
						  d.getDate().padLeft(),
						  d.getFullYear()].join('/') +' ' +
						  [d.getHours().padLeft(),
						  d.getMinutes().padLeft(),
						  d.getSeconds().padLeft()].join(':');
			   
				dirPath = receivedMessage.substring(4).replace(/\//g, '\\');
				readDirectoryAndSend(dirPath, socket);
			} catch (error){
				console.error(error);
				console.log(now + ' ' + clientAddress + ' ERR            want to see dir  ' + path.resolve(dirPath));
			}				
		} else if (receivedMessage.toUpperCase().startsWith("PUT")){
			var d = new Date,
				now = [(d.getMonth()+1).padLeft(),
					  d.getDate().padLeft(),
					  d.getFullYear()].join('/') +' ' +
					  [d.getHours().padLeft(),
					  d.getMinutes().padLeft(),
					  d.getSeconds().padLeft()].join(':');
		   
			fileName = receivedMessage.substring(4).replace(/\//g, '\\');
			isPut = true;
		} else if (isPut){
			fsp.appendFile(fileName, data, (err) => {
				if (err) {
					console.log(now + ' ' + clientAddress + ' ERR            want to put file ' + fileName);
				} else {
					console.log(now + ' ' + clientAddress + ' ' + padNumberWithSpaces(data.length, 10) + ' want to put file ' + fileName);
					socket.read(data);
				}
			});
		}
			
	});

});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
