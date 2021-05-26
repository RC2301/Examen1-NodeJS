const { argv } = require("./config/yargs");
const colors = require("colors")
const { leerDatos } = require("./ctd/leer")
let comando = argv._[0];

switch (comando) {
    case "publicar":
        leerDatos(argv.file, argv.country, argv.year, 1);
        break;
    case "guardar":
        leerDatos(argv.file, argv.country, argv.year)
        break;
    default:
        console.log("Comando no válido");
        break;
}