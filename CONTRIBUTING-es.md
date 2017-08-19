# Guía para contribuir a los proyectos de vikserver
### Muchas gracias por contribuir!
Esta guía abarca la forma de contribuir a cualquiera de los proyectos de la organización vikserver y es aplicable en ambos
## Cómo contribuir al proyecto
- Para contribuir, debes estar al día de las necesidades actuales de este proyecto
- Pull Request
  - Deben de seguir la plantilla destinada para ello
  - La plantilla se puede editar mediante un Pull Request hacia la plantilla. Todos los PR que no sigan esta plantilla serán deshechados salvo excepciones.
  - Si se añaden nuevas dependencias deben seguir las reglas para dependencias
  - Cuando se modifica crypto.js o socketctl.js se deben seguir las reglas de criptografía y comunicaciones
  - Si las modificaciones tienen que ver con lo que el usuario ve, se deben seguir las reglas de Comunicaciones con el usuario
- Incidencias
  - Cuando se produce una incidencia en la página es muy importante que la reportes para que podamos solucionarla
  - Hay una plantilla específica para las incidencias. Por favor, recuerda el esfuerzo que conlleva hacer este tipo de formularios, así que usa esta plantilla tanto como puedas. La plantilla se puede modificar mediante PR
  - También puedes pedir nuevas características mediante el reporte de incidencias marcando la opción "solicitud de características" en la primera pregunta.

## Cuáles son las necesidades del proyecto actualmente
- Puedes encontrar algunas de las cosas que nos gustaría ir haciendo en [nuestra página de proyectos](https://github.com/orgs/vikserver/projects)
- Lo que siempre necesitaremos
  - Probar los nuevos añadidos al proyecto
  - Reportes de fallos
  - Pequeños retoques en la documentación

## Reglas para las dependencias
- Las dependencias pueden ser introducidas mediante
  - Un pull request en mrvik/jsloader para añadir una nueva definición (La URL de una CDN)
  - Un submódulo en vikserver/vikserver2
  - En el caso de las fuentes introduciéndolas directamente en /fonts
- Las dependencias siempre se cargan de la misma manera
  - Archivos JS y CSS
    - Mediante la función load() de mrvik/jsloader
  - Fuentes
    - Desde las hojas de estilo
  - Otros archivos (Como HTML)
    - Con la API de fetch()
    - Se pueden introducir otros métodos de carga siempre y cuando
      - Sean asíncronos
      - No bloqueen la ejecución del script
      - Se documente por qué se utilizan

## Reglas de criptografía y comunicaciones
Siempre que se modifica socketctl.js se cambia la manera en la que se comunica con el servidor de WebSockets
Muchas de las veces que se modifica cryptoJS se cambia lo que se envía al servidor de WS
Por lo tanto, es fundamental seguir estas reglas para que el proyecto siga manteniendo la seguridad y la velocidad
- Criptografía
  - El framework que se utiliza es openpgp.js. No debería encriptarse nada con otros frameworks salvo excepciones
  - El otro framework es js-sha256. No debe usarse otro salvo excepciones
  - Excepciones:
    - Hay otro framework que funciona más rápido o es más seguro. (Las dos cosas deben ir de la mano en estos casos)
    - Otro framework aporta funcionalidades nuevas y que pueden ayudar a que el proyecto sea más rápido y seguro
- Comunicaciones
  - Cuando se modifican cosas que se envían al servidor, se debe asegurar que sea compatible. De otra manera:
    - Se deben documentar los cambios y especificar qué es lo que cambia o
    - Abrir un PR en vikserver/vikserver-backend con los cambios necesarios
  - Todas las comunicaciones que incluyan contenido sensible deben ir cifradas. Para esto ya hay funciones establecidas que funcionan como las normales.

## Reglas de comunicación con el usuario
Cuando hay que comunicarse con el usuario se debe de tener un especial cuidado con los términos que se usan. Para esto hay directrices muy claras en [la guía de google sobre Material Design](https://material.io/guidelines/style/writing.html#writing-language)
