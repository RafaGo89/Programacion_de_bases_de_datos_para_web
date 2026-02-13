const direccion = {
  calle: 'Juárez',
  numero: 976,
  colonia: 'Moderna',
  ciudad: 'Guadalajara',
  estado: 'Jalisco',
  cp: '45100',
  casaHabitacion: false,
  coordenadas: {
    latitud: 178.345,
    longitud: -123.456,
  },
  coloresFachada: ['Gris', 'Blanco', 'Negro'],
  'número de moradores': 25,
  //numeroDeMoradores: 25
  //"numero-de-moradores2": 25
  // Sobrescritura del método toString() heredado del
  // prototipo de Object
  toString: function () {
    return (
      `${this.calle} ${this.numero}, ` +
      `Colonia ${this.colonia}, ${this.ciudad}, ` +
      `${this.estado}, CP ${this.cp}`
    );
  },
  mostrarCoordenadas: function () {
    // Latitud: 178.345, Longitud: -123.456
    return (
      `Latitud: ${this.coordenadas.latitud}, ` +
      `Longitud: ${this.coordenadas.longitud}`
    );
  },
  mostrarColores: function () {
    // 'Gris, Blanco, Negro'
    //return `${this.coloresFachada.join(', ')}`;
    return this.coloresFachada.join(', ');
  },
};

console.log(direccion.toString());
console.log(direccion.mostrarCoordenadas());
console.log(direccion.mostrarColores());

console.log(direccion);

console.log(direccion.calle);
console.log(direccion.coordenadas);
console.log(direccion.coordenadas.latitud);
console.log(direccion.coloresFachada[1]);

direccion.pais = 'México'; // Nueva propiedad

console.log(direccion);
console.log(direccion.pais);

delete direccion.casaHabitacion; // Eliminar propiedad
console.log(direccion);

//console.log(direccion.'número de moradores');

console.log(direccion['calle']);
console.log(direccion['número de moradores']);

const obj1 = new Object();
console.log(obj1);
obj1.x = 1;
obj1.y = 2;
console.log(obj1);

const fecha1 = new Date();
console.log(fecha1);

const obj2 = { a: 1, b: 2 };
const obj3 = Object.create(obj2);
console.log(obj2);
console.log(obj3);
// Crear objeto tomando como plantilla a otro objeto
const direccion2 = Object.create(direccion);
console.log(direccion2);
console.log(direccion2.mostrarColores());

const llavesDir = Object.keys(direccion);
console.log(llavesDir);
const valoresDir = Object.values(direccion);
console.log(valoresDir);

const propDir = Object.entries(direccion);
console.log(propDir);

console.log(Object.getOwnPropertyDescriptor(direccion, 'calle'));
console.log(Object.getOwnPropertyDescriptors(direccion));

console.log(direccion.hasOwnProperty('pais'));
console.log(direccion.hasOwnProperty('casaHabitacion'));
console.log(direccion.hasOwnProperty('toString'));
console.log(obj1.hasOwnProperty('toString'));

for (let p of Object.values(direccion)) {
  console.log(p);
}

for (let p in direccion) {
  console.log(p);
}
// Determinar si la propiedad "calle" está en el objeto direccion
console.log('calle' in direccion);

for (let p in direccion) {
  console.log(direccion[p]);
}
