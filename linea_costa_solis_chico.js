// ===================== 1. ÁREA DE INTERÉS =====================
var centro = ee.Geometry.Point([-55.70237, -34.78015]);
var radio_m = 2000;
var aoi = centro.buffer(radio_m);

// ===================== 2. PARÁMETROS =====================
var simplTolerance = 30;
var minArea = 1000; // m²

// --------------------------- A. Landsat 1990–2022 -----------------------------
var aniosLandsatA = ee.List.sequence(1990, 2022);
var cloudMaxA = 30;
var thresholdA = 0.0;
var scaleA = 30;

function getLandsatA(anio) {
  anio = ee.Number(anio);
  var fechaInicio = ee.Date.fromYMD(anio, 1, 1);
  var fechaFin = fechaInicio.advance(1, 'year');

  var col;
  if (anio.lte(2011)) {
    col = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
      .filterDate(fechaInicio, fechaFin)
      .map(function(img) {
        var toa = img.multiply(0.0000275).add(-0.2);
        var ndwi = toa.normalizedDifference(['SR_B2', 'SR_B4']).rename('NDWI');
        return img.addBands(ndwi).copyProperties(img, ['system:time_start']);
      });
  } else if (anio.eq(2012)) {
    col = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
      .filterDate(fechaInicio, fechaFin)
      .map(function(img) {
        var toa = img.multiply(0.0000275).add(-0.2);
        var ndwi = toa.normalizedDifference(['SR_B2', 'SR_B4']).rename('NDWI');
        return img.addBands(ndwi).copyProperties(img, ['system:time_start']);
      });
  } else {
    col = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate(fechaInicio, fechaFin)
      .map(function(img) {
        var toa = img.multiply(0.0000275).add(-0.2);
        var ndwi = toa.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');
        return img.addBands(ndwi).copyProperties(img, ['system:time_start']);
      });
  }

  return col.filterBounds(aoi).filter(ee.Filter.lt('CLOUD_COVER', cloudMaxA));
}

var lineas1990_2022 = ee.FeatureCollection(aniosLandsatA.map(function(anio) {
  anio = ee.Number(anio);
  var coleccion = getLandsatA(anio);
  var conteo = coleccion.size();

  return ee.Algorithms.If(
    conteo.gt(0),
    coleccion.select('NDWI').median().gt(thresholdA).clip(aoi).reduceToVectors({
      geometry: aoi,
      geometryType: 'polygon',
      scale: scaleA,
      maxPixels: 1e12,
      eightConnected: false
    }).map(function(f) {
      var area = f.geometry().area(1);
      return ee.Feature(f.geometry().simplify(simplTolerance), {
        'anio': anio,
        'area_m2': area,
        'fuente': 'Landsat'
      });
    }).filter(ee.Filter.gt('area_m2', minArea)),
    ee.FeatureCollection([])
  );
})).flatten();

// --------------------------- B. Landsat 7–8 (2013–2015 y 2017) -----------------------------
var aniosLandsatB = ee.List([2013, 2014, 2015, 2017]);
var cloudMaxB = 30;
var thresholdB = 0.0;
var scaleB = 30;

function getLandsatB(anio) {
  anio = ee.Number(anio);
  var fechaInicio = ee.Date.fromYMD(anio, 1, 1);
  var fechaFin = fechaInicio.advance(1, 'year');
  var col;

  if (anio.eq(2017)) {
    col = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2');
  } else {
    col = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
  }

  return col.filterDate(fechaInicio, fechaFin)
            .filterBounds(aoi)
            .filter(ee.Filter.lt('CLOUD_COVER', cloudMaxB))
            .map(function(img) {
              var toa = img.multiply(0.0000275).add(-0.2);
              var ndwi = anio.eq(2017)
                ? toa.normalizedDifference(['SR_B2', 'SR_B4'])
                : toa.normalizedDifference(['SR_B3', 'SR_B5']);
              return img.addBands(ndwi.rename('NDWI')).copyProperties(img, ['system:time_start']);
            });
}

var lineas2013_2017 = ee.FeatureCollection(aniosLandsatB.map(function(anio) {
  anio = ee.Number(anio);
  var coleccion = getLandsatB(anio);
  var conteo = coleccion.size();

  return ee.Algorithms.If(
    conteo.gt(0),
    coleccion.select('NDWI').median().gt(thresholdB).clip(aoi).reduceToVectors({
      geometry: aoi,
      geometryType: 'polygon',
      scale: scaleB,
      maxPixels: 1e12,
      eightConnected: false
    }).map(function(f) {
      var area = f.geometry().area(1);
      return ee.Feature(f.geometry().simplify(simplTolerance), {
        'anio': anio,
        'area_m2': area,
        'fuente': anio.eq(2017) ? 'Landsat7' : 'Landsat8'
      });
    }).filter(ee.Filter.gt('area_m2', minArea)),
    ee.FeatureCollection([])
  );
})).flatten();

// --------------------------- C. Sentinel-2 (2017–2024) -----------------------------
var aniosSentinel = ee.List.sequence(2017, 2024);
var cloudMaxC = 10;
var thresholdC = 0.0;
var scaleC = 10;
var simplToleranceC = 20;

var lineas2017_2024 = ee.FeatureCollection(aniosSentinel.map(function(anio) {
  anio = ee.Number(anio);
  var fechaInicio = ee.Date.fromYMD(anio, 1, 1);
  var fechaFin = fechaInicio.advance(1, 'year');

  var coleccion = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterBounds(aoi)
    .filterDate(fechaInicio, fechaFin)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloudMaxC))
    .map(function(img) {
      var ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI');
      return img.addBands(ndwi).copyProperties(img, ['system:time_start']);
    });

  var conteo = coleccion.size();

  return ee.Algorithms.If(
    conteo.gt(0),
    coleccion.select('NDWI').median().gt(thresholdC).clip(aoi).reduceToVectors({
      geometry: aoi,
      geometryType: 'polygon',
      scale: scaleC,
      maxPixels: 1e12,
      eightConnected: false
    }).map(function(f) {
      var area = f.geometry().area(1);
      return ee.Feature(f.geometry().simplify(simplToleranceC), {
        'anio': anio,
        'area_m2': area,
        'fuente': 'Sentinel2'
      });
    }).filter(ee.Filter.gt('area_m2', minArea)),
    ee.FeatureCollection([])
  );
})).flatten();

// ===================== 4. COMBINACIÓN Y EXPORTACIÓN =====================
var lineasFinal = lineas1990_2022.merge(lineas2013_2017).merge(lineas2017_2024);

Map.centerObject(aoi, 13);
Map.addLayer(lineasFinal, {color: 'orange'}, 'Líneas 1990–2024 unificadas');

Export.table.toDrive({
  collection: lineasFinal,
  description: 'LineasCosta_SolisChico_1990_2024_UNIFICADO',
  fileFormat: 'GeoJSON'
});
