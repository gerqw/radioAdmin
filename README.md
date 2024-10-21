# Radio Template
Este proyecto está desarrollado en Node.js. El front-end utiliza la librería MUI React. El template muestra estaciones en un mapa, agrupar sus equipos y verifica que esten operativos.

## Requerimientos
- Tener Node.js instalado, preferentemente la última versión: [Descargar Node.js](https://nodejs.org/en/download/package-manager).

## Configuraciones
Después de descargar el repositorio, hay que configurar los datos. Se encuentran en el archivo `data.json` (en la raíz del proyecto). Se configuran las estaciones y los equipos que tiene cada una. El JSON es:

```json
{
  "estaciones": [
    {
      "nombre": "Nombre de la estación",
      "gps": "valor_gps",
      "ping": true,
      "equipos": [
        {
          "nombre": "Nombre del equipo",
          "ip": "direccion_ip",
          "ping": true
        }
      ]
    }
  ]
}
```

Donde se define la estación y los equipos. 
```json
"estaciones": [  //es una array con todas las estaciones
    {
     "nombre" : "el que desee"
      "gps": "[coordenadas en el formato XX,XXX]"
       "ping": "pude ser true or false (es indistinto el valor)" 

```
En las estaciones se coloca el nombre representativo que le queramos dar a la torre con los equipos que tiene, los equipos se definen como:
```json
        "equipos": [  //es una array los equipos por estaciones
         {
          "nombre": "Nombre del equipo",
          "ip": "direccion_ip",
          "ping": "pude ser true or false (es indistinto el valor)" 
        },
        {}
        ]

```


## Debugging
Para iniciar, nos posicionamos en la carpeta donde tenemos el proyecto. Por ejemplo:

`C://Usuarios/usuario/Descargas/radioAdmin/`

Abrimos un CMD y ejecutamos:

`node start.js`

(es necesario tener a node como variable de entorno)
