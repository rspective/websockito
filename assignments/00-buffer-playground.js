exports.problem = function () { /*
# Topic

Explanation with *Markdown* formatting.

You can embed even code `"abc".toUpperCase()`.

Enjoy!
*/}.toString().split('\n').slice(1,-1).join('\n');

exports.solution = "Stringified solution!";

exports.verify = function (args, done) {
    done(true);
};
