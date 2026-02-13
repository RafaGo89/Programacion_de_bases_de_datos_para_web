console.log("Variables y constantes");

console.log("Tipos de datos primitivos");

let x;

console.log(typeof x);
x = 10;
console.log(typeof x);

let saludo = "Hola";
console.log(typeof saludo);

x = true;
console.log(typeof x);

let y = 3.1416;
console.log(typeof y);

let z = undefined;
console.log(typeof z);

let n = null;
console.log(typeof n);

const c = 123;

// c = 567;

const c2 = "Constante";

console.log(typeof c2);

var k = 123;
console.log(typeof k);

//alert("Hola");

//let alert = 123;

//alert("Hola");

let x1 = 10,
  y1 = 20,
  z1 = 30;

console.table({ x1, y1, z1 });

console.log(saludo + " " + c2);

console.log(saludo + x1);
console.log(x1 + y1);

console.log(x1 + y1 + c2);
console.log(c2 + x1 + y1);

// let nombre = prompt("Introduce tu nombre:");

// alert(nombre);

//let respuesta = confirm("¿Continuar?");

//alert(respuesta);

let symbol1 = Symbol("a");
let symbol2 = Symbol("a");

console.log(symbol1 === symbol2);

console.log(undefined + "");
console.log(parseInt(undefined));
if (z) {
  console.log("verdadero");
} else {
  console.log("falso");
}

console.log("    " - 10);

console.log("10" - 2);

console.log(1 / 0);
console.log(-1 / 0);

/**************** OPERADORES LÓGICOS ****************** */

let a1 = 10;
let b1 = "Hola";
let c1; // undefined
let d1 = 0;

console.log(a1 && b1);
console.log(c1 && b1);
console.log(b1 && c1);
console.log(d1 && b1);
console.log(b1 && d1);
console.log(c1 && d1);

console.log(a1 || b1);
console.log(c1 || d1);

console.log(!a1);
console.log(!c1);

console.log(5 < "7");
console.log(4 == 4.0);

console.log("5.0" == 5); // Sólo considera el valor

console.log("5.0" === 5); // Considera valor y tipo de dato
