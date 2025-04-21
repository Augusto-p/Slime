const $HOME = process.env.HOME;
const $TRASH = path.join($HOME,`.local/share/Trash/files`);

let Config = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/json/Config.json'), 'utf-8'));

function UpdateConfig(Propity, Value) {
    Config[Propity] = Value;
    fs.writeFileSync("static/json/Config.json", JSON.stringify(Config, null, 4), 'utf-8');
    
}
 