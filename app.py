from flask import Flask, render_template, jsonify
import geopandas as gpd
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/comunas')
def comunas():
    comunas_gdf = gpd.read_file('data/comunas_y_corregimientos.geojson')
    comunas_gdf = comunas_gdf.to_crs(epsg=4326)  # Transformar a WGS 84
    return jsonify(json.loads(comunas_gdf.to_json()))  # Convertir de nuevo a JSON para la respuesta

@app.route('/mejoramientos')
def mejoramientos():
    # Asumiendo que mejoramientos ya está en EPSG:4326 o que necesitas convertirlo también
    mejoramientos_gdf = gpd.read_file('data/Mejoramientos_2023.json')
    if mejoramientos_gdf.crs is not None and mejoramientos_gdf.crs != 'EPSG:4326':
        mejoramientos_gdf = mejoramientos_gdf.to_crs(epsg=4326)
    return jsonify(json.loads(mejoramientos_gdf.to_json()))

if __name__ == '__main__':
    app.run(debug=True)
