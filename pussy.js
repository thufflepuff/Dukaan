// your code goes here
function rounding(x) {
    return Math.round(x);
}

function solution(a, n, b, m) {
    let maxFlatLine = 0;
    let currentFlatLine = 0;

    for (let i = 0; i < Math.min(n, m); i++) {
        if (rounding(a[i] / b[i]) === 1) {
            currentFlatLine++;
            maxFlatLine = Math.max(maxFlatLine, currentFlatLine);
        } else {
            currentFlatLine = 0;
        }
    }
    console.log(maxFlatLine);
    return maxFlatLine;
}

function main() {
    const readline = require("readline");
    const rl = readline.createInterface(process.stdin, process.stdout);

    let args = [];
    let n;
    let m;
    let a;
    let b;

    rl.on("line", (input) => {
        args.push(input);

        if (args.length === 1) {
            n = parseInt(args[0]);
        } else if (args.length === n + 1) {
            a = args.slice(1, n + 1).map(Number);
        } else if (args.length === n + 2) {
            m = parseInt(args[n + 1]);
        } else if (args.length === n + m + 2) {
            b = args.slice(n + 2, n + m + 3).map(Number);
            console.log(solution(a, n, b, m));
            rl.close();
        }
    });

    rl.prompt();
}

main();
