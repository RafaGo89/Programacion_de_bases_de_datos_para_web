/***************** Declaración de funciones ********************/

function cuadrado(x) {
  return x * x;
}

let resp = cuadrado(2);
console.log(resp);

for (let i = 1; i <= 10; ++i) {
  function cubo(x) {
    return x * x * x;
  }
  console.log(cubo(i));
}

console.log(cubo(3));

function hipotenusa(catOpuesto, catAdyacente) {
  function raizCuadrada(x) {
    return Math.sqrt(x);
  }

  return raizCuadrada(catOpuesto * catOpuesto + catAdyacente * catAdyacente);
}

//console.log(raizCuadrada(2));
console.log(hipotenusa(3, 4));

/***************** Expresiones de funciones ********************/

// La referencia del objeto de la función se asigna a una variable
const cuadrado1 = function (x) {
  return x * x;
};

let resp1 = cuadrado1(3);
console.log(resp1);

let x = 10;
console.log(x);

// Una función puede ser creada e invocada en la misma instrucción
let res = (x => x * x)(10);
console.log(res);

/***************** Funciones flecha ********************/

const cuadrado2 = x => {
  return x * x;
};

let resp2 = cuadrado(4);
console.log(resp2);

// Si el cuerpo de una función flecha consiste de una sola instrucción
// de retorno, es posible omitir las llaves del cuerpo y la palabra
// reservada "return"

// Si los parámetros de la función consisten de un solo elemento,
// es posible omitir los paréntesis
const cuadrado3 = x => x * x;

let resp3 = cuadrado3(5);
console.log(resp3);

// Si la función no tiene parámetros, se escriben paréntesis vacíos
// como una lista vacía de parámetros
const saludar = () => {
  console.log('Hola');
};

saludar();

/***************** Funciones como métodos ********************/

const triangulo1 = {
  catOpuesto: 3,
  catAdyacente: 4,

  // hipotenusa: function() {
  //   function raizCuadrada(x) {
  //     return Math.sqrt(x);
  //   }

  //   return raizCuadrada(
  //     this.catOpuesto * this.catOpuesto + this.catAdyacente * this.catAdyacente
  //   );
  // },
  hipotenusa() {
    function raizCuadrada(x) {
      return Math.sqrt(x);
    }

    return raizCuadrada(
      this.catOpuesto * this.catOpuesto + this.catAdyacente * this.catAdyacente
    );
  },
};

console.log(triangulo1.hipotenusa());

const f = function () {
  return this.catOpuesto + this.catAdyacente + this.hipotenusa();
};

// console.log(f());
// Agregar dinámicamente un método al objeto triangulo1
triangulo1.periferia = f;

console.log(triangulo1.periferia());

console.log(triangulo1.catOpuesto);
console.log(triangulo1['catAdyacente']);
console.log(triangulo1['periferia']());

// Invocar el constructor del objeto Date
const fecha1 = new Date();

// Sobrescribir el método toString de triangulo1 para
// que regrese información del triángulo:
// "El triángulo tiene cateto opuesto de 3, cateto adyacente de 4"
// " e hipotenusa de 5".
const f1 = function () {
  return (
    `El triángulo tiene cateto opuesto de ${this.catOpuesto},` +
    ` cateto adyacente de ${this.catAdyacente} e hipotenusa de ` +
    `${this.hipotenusa()}.`
  );
};
triangulo1.toString = f1;

// Invocación implícita de triangulo1.toString()
console.log(triangulo1 + '');
console.log(triangulo1.toString());

/************ Invocación de funciones con call y apply ***********/

const arr1 = [1, 2, 3];

console.log(arr1.join('-'));

const string1 = 'Hola';

// console.log(string1.join("-"));
// Los argumentos de la función (join) se pasan como una lista
console.log(Array.prototype.join.call(string1, '-'));
// Los argumentos de la función (join) se pasan como un arreglo
console.log(Array.prototype.join.apply(string1, ['-']));

/***************** Argumentos y parámetros ***********************/
function cuadrado4(x) {
  return x * x;
}

console.log(cuadrado4(1));
console.log(cuadrado4(1, 2, 3, 4, 5));
console.log(cuadrado4('Hola'));

// Parámetros con valores por omisión y con parámetros de tipo rest
// (acepta un número no fijo de parámetros)
function sumar(x = 0, y = 0, ...rest) {
  let suma = x + y;
  // Si rest no está vacío, ir sumando los elementos del arreglo rest
  // Verificar si el arreglo rest no está vacío
  if (rest.length > 0) {
    for (let n of rest) suma += n;
  }
  return suma;
}

console.log(sumar());
console.log(sumar(1));
console.log(sumar(2, 3));
console.log(sumar(2, 3, 4, 5));

// Si no se pasan argumentos, regresar NaN; de lo contrario,
// regresar la suma de los valores del arreglo rest
function sumar2(...rest) {
  if (rest.length === 0) return NaN;
  let suma = 0;
  for (let n of rest) suma += n;
  return suma;
}
console.log(sumar2()); // NaN
console.log(sumar2(1)); // 1
console.log(sumar2(2, 3)); // 5
console.log(sumar2(2, 3, 4, 5)); // 14

// Obtener el valor mínimo de una lista de números

function minimo(x = NaN, ...rest) {
  let min = x;

  // Obtener el valor mínimo
  for (let n of rest) {
    // Determinar si el valor n-ésimo es menor que el mínimo actual
    if (n < min) {
      min = n;
    }
  }
  //for (let i = 0; i < rest.length; ++i) {}
  return min;
}

console.log(minimo()); // NaN
console.log(minimo(2)); // 2
console.log(minimo(2, -3, 100, 45, -11, 45)); // -3

function maximo(x = NaN, ...rest) {
  let max = x;

  // Obtener el valor mínimo
  for (let n of rest) {
    // Determinar si el valor n-ésimo es menor que el mínimo actual
    if (n > max) {
      max = n;
    }
  }
  //for (let i = 0; i < rest.length; ++i) {}
  return max;
}

console.log(maximo()); // NaN
console.log(maximo(2)); // 2
console.log(maximo(2, -3, 100, 45, -11, 45)); // -3

/***** "Desestructuración" de argumentos ******/

function sumarVectores(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

const vector1 = [1, 2];
const vector2 = [3, 4];

console.log(sumarVectores(vector1, vector2));

function sumarVectores2([x1, y1], [x2, y2]) {
  return [x1 + x2, y1 + y2];
}

console.log(sumarVectores2(vector1, vector2));

/****************** Funciones constructoras ****************/

// Función constructora para objetos de tipo triángulo rectángulo

function TrianguloRectangulo(catOpuesto, catAdyacente) {
  this.catOpuesto = catOpuesto; // Propiedad = Parámetro
  this.catAdyacente = catAdyacente;

  // Método para calcular el área del triángulo
  this.area = function () {
    return (this.catOpuesto * catAdyacente) / 2;
  };

  this.hipotenusa = function () {
    function raizCuadrada(x) {
      return Math.sqrt(x);
    }

    return raizCuadrada(
      this.catOpuesto * this.catOpuesto + this.catAdyacente * this.catAdyacente
    );
  };

  this.toString = function () {
    return (
      `El triángulo tiene cateto opuesto de ${this.catOpuesto},` +
      ` cateto adyacente de ${this.catAdyacente} e hipotenusa de ` +
      `${this.hipotenusa()}.`
    );
  };
}

const tr1 = new TrianguloRectangulo(3, 4);
console.log(tr1.area());
console.log(tr1.hipotenusa());
console.log(tr1.toString());

const tr2 = new TrianguloRectangulo(6, 7);
console.log(tr2.area());
console.log(tr2.hipotenusa());
console.log(tr2.toString());
