# Vikserver2
[![Build Status](https://travis-ci.org/vikserver/vikserver2.svg?branch=master)](https://travis-ci.org/vikserver/vikserver2)

### Esto es la continuación del proyecto vikserver
El proyecto vikserver no estaba aprovechando todos los adelantos que hay en el lado del cliente y por eso hemos decidido reescribir la app desde cero
En este proyecto intentaremos acercarnos lo más posible a ser un almacén de links seguro, rápido y efectivo. 
Estos son nuestros objetivos
- Que el usuario vea que la app es...
  - Sencilla
  - Rápida
  - Estable
  - Segura
- Para lograr estos objetivos estamos tratando de seguir las recomendaciones de Google sobre el Material Design
- La velocidad la medimos teniendo en cuenta los reportes de lightHouse, que iremos subiendo a GitHub
- En cuanto a la seguridad hay que tener en cuenta lo siguiente
  - No podemos garantizar que ningún programa de tu ordenador pueda ver las teclas que pulsas
  - Tampoco podemos garantizar que ningún programa lea el contenido de tu base de datos mientras estás en tu cuenta
  - No podemos asegurar que la contraseña sea fuerte. Nosotros tratamos de hacer lo más que podemos en este campo, pero finalmente eres tú el que tiene el control sobre la fortaleza de tu contraseña
  - Lo que sí que podemos asegurar es lo siguiente
    - Si nadie más que tú sabe la contraseña, cuando no tengas la sesión abierta nadie más que tú podrá acceder a tu cuenta
    - Nosotros no podemos recuperar tu contraseña si la pierdes. Podemos darte una clave excelentemente cifrada que solo tu puedes descifrar, nada más
    - Las comunicaciones con el servidor se realizan mediante conexiones encriptadas con TLS y los mensajes con contenido sensible se encriptan con PGP, de modo que solo el servidor puede verlos.

### Contribuciones
- Las contribuciones son bienvenidas. En el futuro crearemos unas guías al respecto así como una plantilla para las incidencias y los pull request
- Las contribuciones pueden ser en...
  - ... Documentación. Necesitamos una página de FAQs para resolver preguntas rápidamente
  - ... Arreglo de incidencias
  - ... Nuevas características (Recordar que a veces esto incluye el backend de la página)
  - ... Recomendaciones sobre métodos desfasados
  - ... Compatibilidad de la página en distintos navegadores (InternetExplorer no es ni será un navegador soportado por este proyecto)
