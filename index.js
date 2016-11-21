var righto = require('righto'),
    fs = require('fs'),
    path = require('path');

function getFileInfos(currentPath, fileNames, callback){
    var fileStats = righto.all(fileNames.map(function(fileName){
        var filePath = path.join(currentPath, fileName);

        return righto(fs.stat, filePath).get(stat => ({stat, filePath, fileName}));
    }));

    fileStats(callback);
}

function searchNode(fileNameMatch, currentPath, depth, options, shallowestDepth, callback){
    depth = depth || 0;

    // Something was found at a shallower depth than we are currently searching.
    if(depth >= shallowestDepth()){
        return callback();
    }

    var fileNames = righto(fs.readdir, currentPath),
        infos = righto(getFileInfos, currentPath, fileNames);

    infos(function(error, infos){
        if(error){
            return callback();
        }

        var match = infos
            .filter(info => info && info.stat.isFile())
            .find(info => info.fileName.match(fileNameMatch));

        if(match){
            if(shallowestDepth() <= depth){
                return callback();
            }

            shallowestDepth(depth);
            return callback(null, {filePath: match.filePath, depth});
        }

        if(depth >= options.maxDepth){
            return callback();
        }

        var directories = infos
            .filter(info => info && info.stat.isDirectory())
            .map(info => info.filePath);

        var subResults = righto.all(directories.map(function(directoryPath){
            return righto(searchNode, fileNameMatch, directoryPath, depth + 1, options, shallowestDepth);
        }));

        subResults(function(error, results){
            var result = results.find(function(result){
                return result;
            });

            callback(null, result);
        });
    });
}

module.exports = function(searchPath, fileNameMatch, options, callback){
    options = options || {};

    if(isNaN(options.maxDepth)){
        options.maxDepth = Infinity;
    }

    var shallowestFoundDepth = Infinity,
        currentResult,
        inFlight = 0;

    function shallowestDepth(depth){
        if(arguments.length < 1){
            return shallowestFoundDepth;
        }

        shallowestFoundDepth = depth;
    }

    searchNode(fileNameMatch, searchPath, 0, options, shallowestDepth, function(error, result){
        if(!result){
            return callback();
        }

        callback(null, result.filePath);
    });
}