# find-shallow-file

Finds a matching file as shallowly as possile in a given directory.

# usage


Search for `index.*` in `someDirectory`, searching up to 10 directories deep.

```
findShallowestFile('someDirectory', /index\..*?/, {maxDepth: 10}, function(error, result){

    // cant error.

    // result will be either null or a path to the shallowest file that matched the regex.

});
```

See the tests for more examples.