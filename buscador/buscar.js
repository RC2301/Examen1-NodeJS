const csv = require('csv-parser');
const fs = require('fs');
const colors = require("colors")
let datosCSV = [];
let resultado = [];
const leerDatos = (path, cod, year, guardar) => {
    let n = 0;
    let pais;
    let data;
    fs.createReadStream(path)
        .pipe(csv({ headers: false }))
        .on('data', (row) => {
            if (n > 4) {
                datosCSV.push(row);
            } else {
                delete row;
                n++;
            }
        })
        .on('end', () => {
            pais = datosCSV.find(obj => obj[1] === cod);

            if (year > 2019 || year < 1960) {
                console.log("EL año es incorrecto".red);
                return 1;
            }
            if (pais) {
                data = arreglar(cod, year);
            } else {
                console.log("El codigo del país no existe".red);
                return 1;
            }
            if (guardar === 1) {
                imprimir(data, cod, year);
                guardar = 0;
            }
            if (guardar === undefined || guardar === true) {
                console.log("Nombre del arhivo no es correcto".red);
            }
        });
}
const arreglar = (cod, year) => {
    var arr = datosCSV.map(item => {
        return {
            nombre_ciudad: item[0],
            codigo_ciudad: item[1],
            year: {
                '1960': item[4],
                '1961': item[5],
                '1962': item[6],
                '1963': item[7],
                '1964': item[8],
                '1965': item[9],
                '1966': item[10],
                '1967': item[11],
                '1968': item[12],
                '1969': item[13],
                '1970': item[14],
                '1971': item[15],
                '1972': item[16],
                '1973': item[17],
                '1974': item[18],
                '1975': item[19],
                '1976': item[20],
                '1977': item[21],
                '1978': item[22],
                '1979': item[23],
                '1980': item[24],
                '1981': item[25],
                '1982': item[26],
                '1983': item[27],
                '1984': item[28],
                '1985': item[29],
                '1986': item[30],
                '1987': item[31],
                '1988': item[32],
                '1989': item[33],
                '1990': item[34],
                '1991': item[35],
                '1992': item[36],
                '1993': item[37],
                '1994': item[38],
                '1995': item[39],
                '1996': item[40],
                '1997': item[41],
                '1998': item[42],
                '1999': item[43],
                '2000': item[44],
                '2001': item[45],
                '2002': item[46],
                '2003': item[47],
                '2004': item[48],
                '2005': item[49],
                '2006': item[50],
                '2007': item[51],
                '2008': item[52],
                '2009': item[53],
                '2010': item[54],
                '2011': item[55],
                '2012': item[56],
                '2013': item[57],
                '2014': item[58],
                '2015': item[59],
                '2016': item[60],
                '2017': item[61],
                '2018': item[62],
                '2019': item[63],
                '2020': item[64]
            }

        };
    });
    let countryC = require("../datoscsv/ISO-3166-ALPHA-3.json");
    let arreglado = [];
    for (const i in arr) {
        for (const key in countryC) {
            if (arr[i].codigo_ciudad === countryC[key].countryCode) {
                arreglado.push(arr[i]);
            }
        }
    }
    calcularMedia(arreglado, cod, year);
    let top = topCinco(arreglado, year);
    resultado.push({ top5: top });
    return arreglado;
}
const calcularMedia = (datos, cod, year) => {
    let cont = 0;
    let len = 0;
    for (let i = 0; i < datos.length; i++) {
        datoy = Number(datos[i].year[year]);
        if (datoy && datoy != 0) {
            cont += datoy;
            len++;
        }
    }
    media = cont / len;
    mediaR = media.toFixed(2);
    if (mediaR > 0) {
        resultado.push({ mediaMundial: mediaR });
    } else {
        resultado.push({ mediaMundial: "Sin dato" });
    }

    let result = valorSPais(datos, mediaR, cod, year);
    resultado.push({ MayorOMenor: result });

}
const valorSPais = (datos, media, cod, year) => {
    let pais = datos.find(obj => obj.codigo_ciudad === cod);

    let datoPais = pais.year[year];

    datoPaises(datos, datoPais, year);
    if (datoPais > media) {
        return `El valor de las suscripciones del país ${cod} - ${pais.nombre_ciudad} con: ${datoPais} en el año ${year}
                si es mayor a la media mundial`;
    } else {
        return `La media mundial en el año ${year} es mayor a las suscripciones del país ${pais.nombre_ciudad}: ${datoPais}`;
    }

}

const datoPaises = (datos, sumaP, year) => {
    let vec = [];
    for (const i in datos) {
        if (datos[i].year[year] && datos[i].year[year] != 0) {
            nombre = datos[i].nombre_ciudad;
            suma = Number(datos[i].year[year]);
            vec.push({ nombre, suma });
        }
    }

    let porE = porEncima(vec, sumaP);
    let porD = porDebajo(vec, sumaP);
    resultado.push({ PorEncima: porE });
    resultado.push({ PorDebajo: porD });

}

const porEncima = (vec, sumaP) => {
    // Ordenación del array para obtener los 5 paises por encima
    vec.sort(function(a1, b2) {
        if (a1.suma > b2.suma) {
            return 1;
        } else if (a1.suma < b2.suma) {
            return -1;
        }
        return 0;
    });
    //Los 5 paises por encima del pais especificado
    let porE = [];
    for (const key in vec) {
        if (vec[key].suma > sumaP) {
            porE.push(vec[key]);
        }
    }
    if (porE < 1) {
        return false;
    }
    //Impresión de los 5 paises
    let result = [];
    for (let i = 0; i < 5; i++) {
        result.push(porE[i]);
    }
    return result;
}
const porDebajo = (vec, sumaP) => {
    // Ordenación del array para obtener los 5 paises por debajo
    vec.sort(function(a1, b2) {
        if (a1.suma > b2.suma) {
            return -1;
        } else if (a1.suma < b2.suma) {
            return 1;
        }
        return 0;
    });
    //Los 5 paises por debajo del pais especificado
    let porE = [];
    for (const key in vec) {
        if (vec[key].suma < sumaP) {
            porE.push(vec[key]);
        }
    }
    if (porE < 1) {
        return false;
    }
    //Impresión de los 5 paises
    let result = []
    for (let i = 0; i < 5; i++) {
        result.push(porE[i]);
    }
    return result;
}
const topCinco = (datos, year) => {
    let vec = [];
    //Obteniendo el nombre y el dato del año especificado
    for (const i in datos) {
        dato = Number(datos[i].year[year]);
        nombre = datos[i].nombre_ciudad;
        datosC = { nombre, dato };
        vec.push(datosC);
    }

    // Ordenando el vector de mayor a menor 
    vec.sort(function(a1, b2) {
        if (a1.dato > b2.dato) {
            return -1;
        } else if (a1.dato < b2.dato) {
            return +1;
        }
        return 0;
    });

    //Obteniendo el top 5 de paises por el año especificado
    let result = []
    for (let i = 0; i < 5; i++) {
        result.push(vec[i]);
    }


    return result;

}
const imprimir = (data, cod, year) => {
    pais = data.find(obj => obj.codigo_ciudad == cod);
    console.log("======================================================================".black.bgWhite);
    console.log("Datos: Personas que usan Internet (% de la población)".green.bgRed);
    console.log(`Pais: ${pais.nombre_ciudad}`.random);
    console.log(`Año: ${year}`.random);
    console.log(`Valor: ${resultado[0].valor}`.random);
    console.log("======================================================================".black.bgWhite);
}

module.exports = { leerDatos }