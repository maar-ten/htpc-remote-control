const server = require('server');
const { spawnSync } = require('child_process');
const { get, put } = server.router;
const { render } = server.reply;

const KEY_VOLUME_DOWN = 174;
const KEY_VOLUME_UP = 175;
const KEY_PLAY_PAUSE = 179;

server([
    // return index.html for requests to the root of the server
    get('/', ctx => render('index.html')),

    // handle commands
    put('/command/:command', ctx => handleCommand(ctx.params.command)),

    // return 404 for requests that cannot be matched
    get(ctx => status(404))
]);

function handleCommand(command) {
    console.log(command);
    switch (command) {
        case 'volume-up':
            sendKey(KEY_VOLUME_UP);
            break;
        case 'volume-down':
            sendKey(KEY_VOLUME_DOWN);
            break;
        case 'play-pause':
            sendKey(KEY_PLAY_PAUSE);
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
