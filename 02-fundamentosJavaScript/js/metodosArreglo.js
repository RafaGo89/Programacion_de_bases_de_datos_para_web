/************** Métodos iteradores ***********/

let a1 = [10, 20, 30, 40, 50];

// Desplegar cada valor del arreglo
a1.forEach(valor => {
  console.log(valor);
});

// Sumar 1 a todos los elementos del arreglo
a1.forEach((valor, indice, arreglo) => {
  arreglo[indice] = valor + 1;
});

console.log(a1);

// Sumar los valores del arreglo
let suma = 0;
a1.forEach(x => {
  suma += x;
});
console.log(suma);

// Multiplicar cada elemento de a1 por 2, creando un nuevo arreglo
const a2 = a1.map(x => x * 2);

console.log(a2);

// Obtener un arreglo con los elementos mayores a 50

const may50 = a2.filter(x => x > 50); // (x) => { return x > 50 }
console.log(may50);

const may40 = a2.find(x => x > 40);
console.log(may40);

const idxMay60 = a2.findIndex(x => x > 60);
console.log(idxMay60);

console.log(a2.every(x => x > 10));
console.log(a2.every(x => x > 30));

console.log(a2.some(x => x > 30));
console.log(a2.some(x => x > 200));

let a = [1, [2, [3, [4]]]];

console.log(a.flat());
console.log(a.flat(1));
console.log(a.flat(2));
console.log(a.flat(3));
console.log(a.flat(4));

let a4 = a1.concat(a);
console.log(a4);

/************** Métodos para pilas y colas ***********/

const frutas1 = ['Manzana', 'Pera', 'Guayaba', 'Mango'];

let tam = frutas1.push('Kiwi');

console.log(frutas1);
console.log(tam); // Número de elementos del arreglo modificado

let f1 = frutas1.pop();
console.log(f1);
console.log(frutas1);

tam = frutas1.unshift('Kiwi');
console.log(tam);
console.log(frutas1);

let f2 = frutas1.shift();
console.log(f2);
let f3 = frutas1.shift();
console.log(f3);
console.log(frutas1);

/************** Métodos para sub-arreglos ***********/

const a3bis = [10, 20, 30, 40, 50, 20, 40, 20];

// Eliminar 40
a3bis.splice(3, 1);

console.log(a3bis);

// Insertar "Kiwi" en la segunda posición
frutas1.splice(1, 0, 'Kiwi');
console.log(frutas1);
// Reemplazar "Guayaba" por "Piña"
frutas1.splice(2, 1, 'Piña');
console.log(frutas1);
// Insertar "Fresa", "Sandía" y "Naranja" entre "Piña" y "Mango"
frutas1.splice(3, 0, 'Fresa', 'Sandía', 'Naranja');
console.log(frutas1);
// Eliminar los dos primeros elementos
let res = frutas1.splice(0, 2);
console.log(frutas1);
console.log(res);

const frutas2 = frutas1.slice(1, 3);
console.log(frutas2);
console.log(frutas1.slice(2));

const a5 = new Array(10);
console.log(a5);
a5.fill(0);
console.log(a5);
a5.fill('a', 2, 5);
console.log(a5);
a5.fill(true, 5);
console.log(a5);

/************** Métodos de búsqueda y ordenamiento ***********/

console.log(frutas1.includes('Pera'));
console.log(frutas1.includes('Kiwi'));

console.log(frutas1.includes('pera'));

const a3 = [10, 20, 30, 40, 50, 20, 40, 20];

console.log(a3.indexOf(10));
console.log(a3.indexOf(20));
console.log(a3.indexOf(20, 3));
console.log(a3.indexOf(100));
console.log(a3.indexOf('20'));

console.log(a3.lastIndexOf(20));
console.log(a3.lastIndexOf(20, 4));

console.log(frutas1);
frutas1.sort();
console.log(frutas1);

const a6 = [102, 1, 34, -5, 99, 9, 56, 5];
a6.sort(); // Ordena alfabéticamente
console.log(a6);
a6.sort((x, y) => {
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
});
console.log(a6);

a6.sort((x, y) => x - y); // Ordenar números ascendentemente
console.log(a6);

a6.sort((x, y) => y - x); // Ordenar números descendentemente
console.log(a6);

const frutas3 = ['Manzana', 'pera', 'Mango', 'piña', 'PIÑA', 'naranja'];

frutas3.sort();
console.log(frutas3);

let s1 = 'Hola';
let s2 = 'hola';
console.log(s1.toLowerCase() === s2.toLowerCase());

// Ordenar frutas3 alfabéticamente sin importar mayúsculas o minúsculas
frutas3.sort((f1, f2) => {
  const x = f1.toLowerCase();
  const y = f2.toLowerCase();
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
});

console.log(frutas3);

// Copia de frutas3
const frutas4 = [...frutas3];

frutas4.reverse();
console.log(frutas3);
console.log(frutas4);

/************** Métodos de Array a String ***********/

console.log(a6);
const a7 = a6.join();
console.log(a7);
const a8 = a6.join(' ');
console.log(a8);
const frutas5 = frutas3.join('-');
console.log(frutas5);

const fecha1 = [2, 12, 2026];
fecha1String = fecha1.join('/');
console.log(fecha1String);

console.log(fecha1.toString());

console.log(Array.isArray(fecha1));
console.log(Array.isArray(fecha1String));

console.log(fecha1String[2]);

const fecha2 = Array.prototype.join.call(fecha1String, '*');
console.log(fecha2);
