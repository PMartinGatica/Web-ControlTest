// src/services/api.js

// URLs para producción (fuera de localhost) - USANDO RUTAS RELATIVAS
const PROD_SPECS_URL = '/gs/macros/s/AKfycbx0feeplSe_FRg91TW_RCN0LTnj7gtF0WmuVdxQyXdRk8MAq5RVj-WxMrR_8TYaN9cK/exec';
const PROD_BBDD_URL = '/gs/macros/s/AKfycbz8LoeGw2K7-afRKQMtsh6BY1GpOGF3SR2ehLHiNjOzmM0y5WmjWvw0Go_PoJ9jhC71/exec';

// URLs para desarrollo (localhost) - usando proxy
const DEV_SPECS_URL = '/gs/macros/s/AKfycbx0feeplSe_FRg91TW_RCN0LTnj7gtF0WmuVdxQyXdRk8MAq5RVj-WxMrR_8TYaN9cK/exec';
const DEV_BBDD_URL = '/gs/macros/s/AKfycbz8LoeGw2K7-afRKQMtsh6BY1GpOGF3SR2ehLHiNjOzmM0y5WmjWvw0Go_PoJ9jhC71/exec';

// Determina si estamos en localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Usa las URLs correctas según el entorno
const SPECS_URL = isLocalhost ? DEV_SPECS_URL : PROD_SPECS_URL;
const BBDD_URL = isLocalhost ? DEV_BBDD_URL : PROD_BBDD_URL;

export const fetchLineas = async () => {
  try {
    const response = await fetch(SPECS_URL);
    const data = await response.json();
    const unicas = [...new Set(data.map(item => item.Linea).filter(l => l))];
    return unicas;
  } catch (error) {
    throw error;
  }
};

export const fetchSpecs = async (linea, tipoControl) => {
  try {
    const response = await fetch(SPECS_URL);
    const data = await response.json();
    return data.filter(item => item.Linea === linea && item.Tipo === tipoControl);
  } catch (error) {
    throw error;
  }
};

export const sendData = async (datos) => {
  try {
    // Tanto en desarrollo como en producción usamos fetch directo con el proxy
    const response = await fetch(BBDD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    
    const result = await response.json();
    
    return {
      success: true,
      message: `✅ Datos enviados: ${datos.data?.length || 0} registros`,
      serverResponse: result
    };
  } catch (error) {
    console.error('Error al enviar datos:', error);
    return {
      success: false,
      message: `❌ Error: ${error.message}`
    };
  }
};