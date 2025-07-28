# Generador de Scripts de Línea de Costa (1990–2024)

Este repositorio contiene el código JavaScript para Google Earth Engine que permite analizar la evolución de la línea de costa en torno a la desembocadura del arroyo Solís Chico, en Uruguay, utilizando imágenes Landsat y Sentinel-2 entre 1990 y 2024.

## 🌐 Acceso a la miniweb interactiva

Utilizá la siguiente miniweb para generar el script ajustado a tus coordenadas y radio de análisis:

👉 **[Abrir la miniweb](https://gaitapi.github.io/linea-costa-solis-chico/)**

Podrás:
- Cambiar el punto central (latitud y longitud)
- Modificar el radio de análisis (en metros)
- Generar y copiar el script completo al portapapeles
- Pegar y ejecutar directamente en [Google Earth Engine](https://code.earthengine.google.com)

### Captura de pantalla

![Miniweb para generación de script](miniweb.png)

## Archivos principales

- `linea_costa_solis_chico.js`: script completo que une Landsat 5, 7, 8 y Sentinel-2.
- `index.html`: página web interactiva para parametrizar y generar el script.
- `miniweb.png`: imagen opcional para ilustrar la miniweb (puede capturarse desde el navegador).

## Créditos

Desarrollado por [@gaitapi](https://github.com/gaitapi) – Ministerio de Ambiente & Facultad de Ciencias, Uruguay.
