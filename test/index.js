var findShallowestFile = require('../'),
    test = require('tape');

test('Should find .../testDir/index.js', function(t){
    t.plan(1);

    findShallowestFile(__dirname + '/testDir', /index\..*?/, null, function(error, result){
        t.ok(result.match(/testDir\/index\.js/));
    });
});

test('Should find .../testDir/index.(html or css)', function(t){
    t.plan(1);

    findShallowestFile(__dirname + '/testDir', /index\.(?:html|css)/, null, function(error, result){
        t.ok(result.match(/testDir\/(?:a|b)\/index\.(?:html|css)/));
    });
});

test('Should find .../testDir/index.js (maxDepth 1)', function(t){
    t.plan(1);

    findShallowestFile(__dirname + '/testDir', /index\..*?/, {maxDepth: 1}, function(error, result){
        t.ok(result.match(/testDir\/index\.js/));
    });
});

test('Should find nothing (maxDepth 1)', function(t){
    t.plan(1);

    findShallowestFile(__dirname + '/testDir', /index\.(?:html|css)/, {maxDepth: 1}, function(error, result){
        t.ok(result.match(/testDir\/(?:a|b)\/index\.(?:html|css)/));
    });
});

test('Should find .../testDir/index.(html or css) (maxDepth 2)', function(t){
    t.plan(1);

    findShallowestFile(__dirname + '/testDir', /index\.(?:html|css)/, {maxDepth: 2}, function(error, result){
        t.ok(result.match(/testDir\/(?:a|b)\/index\.(?:html|css)/));
    });
});