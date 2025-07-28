# Generador de Scripts para Línea de Costa (1990–2024)

Este repositorio contiene el código JavaScript para Google Earth Engine que permite analizar la evolución de la línea de costa en la desembocadura del arroyo Solís Chico, Uruguay, utilizando imágenes satelitales de las misiones Landsat y Sentinel-2 entre los años 1990 y 2024.

## 🌐 Acceso a la miniweb interactiva

Puede utilizar la siguiente miniaplicación web para generar el script adaptado a sus coordenadas y radio de análisis:

👉 **[Abrir la miniweb](https://gaitapi.github.io/linea-costa-solis-chico/)**

La herramienta permite:
- Cambiar el punto central (latitud y longitud)
- Ajustar el radio del área de análisis (en metros)
- Generar el código completo y copiarlo al portapapeles
- Pegar y ejecutar el script directamente en [Google Earth Engine](https://code.earthengine.google.com)

### Captura de pantalla

![Miniweb para generación del script](miniweb.png)

## Archivos principales

- `linea_costa_solis_chico.js`: script completo que unifica Landsat 5, 7, 8 y Sentinel-2.
- `index.html`: página web interactiva para parametrizar y generar el código.
- `miniweb.png`: imagen opcional para ilustrar la miniaplicación (puede tomarse una captura desde el navegador).

## Créditos

Desarrollado por [@gaitapi](https://github.com/gaitapi) — Ministerio de Ambiente y Facultad de Ciencias, Uruguay.
