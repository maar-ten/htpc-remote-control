const server = require('server');
const { spawnSync } = require('child_process');
const { get, put } = server.router;
const { render } = server.reply;

server([
    // return index.html for requests to the root of the server
    get('/', ctx => render('index.html')),

    // handle commands
    put('/command/:command', ctx => handleCommand(ctx.params.command)),

    // return 404 for requests that cannot be matched
    get(ctx => status(404))
]);

function handleCommand(command) {
    switch (command) {
        case 'volume-up':
            sendKey(175);
            break;
        case 'volume-down':
            sendKey(174);
            break;
        case 'play':
            sendKey(179);
            break;
        case 'pause':
            sendKey(179);
            break;
    }
}

function scriptFactory(key) {
    return `
$wshell = New-Object -ComObject wscript.shell;
$wshell.SendKeys([char]${key});
`;
}

function sendKey(key) {
    const command = scriptFactory(key);
    const { stderr, status } = spawnSync('powershell', ['-command', command])
    if (status !== 0) {
        throw stderr
    }
}
