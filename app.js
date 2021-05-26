const { argv } = require("./config/yargs");
const colors = require("colors")
const { leerDatos } = require("./buscador/buscar")
let comando = argv._[0];

switch (comando) {
    case "mostrar":
        leerDatos(argv.file, argv.country, argv.year, 1);
        break;
    case "guardar":
        leerDatos(argv.file, argv.country, argv.year, 0)
        break;
    default:
        console.log("Comando no válido");
        break;
}