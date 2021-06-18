const fsPromise = require('fs/promises')
const path = require('path');

const { lstatSync, readdir, stat, fchmod, open} = require('fs');


const ChmodFileToAll = (thePath) => open(thePath, 'w', (err, fd) => {
    if (err) {
        throw err;
    }
    fchmod(fd, '777', (err) => {
        if (err) console.error('chmod failed.')
        else console.log('The file: %s has chmoded to 777', thePath);
    })
})

const ChmodDirToAll = (thePath) => {
    readdir(thePath, (err, list) => {
        if (err) return console.error(err);
        let pending = list.length;
        if (pending) {
            list.forEach(file => {
                file = path.resolve(thePath, file);
                stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        ChmodDirToAll(file);
                    } else {
                        ChmodFileToAll(file);
                        if (!--pending) console.log('The path: %s has done', file);
                    }
                })
            })
        }
        fsPromise.chmod(thePath, 777)
        .then(res => {
            console.log("The dir path: %s has chmoded to 777", thePath);
        }).catch(err => {
            console.error(err);
        })
    })
}

const Chmod = (thePath) => 
    lstatSync(thePath).isFile() ? ChmodFileToAll(thePath) : ChmodDirToAll(thePath)
        
Chmod(process.argv[0]);