// src/services/api.js

// URLs para producción (fuera de localhost)
const PROD_SPECS_URL = 'https://script.google.com/macros/s/AKfycbx0feeplSe_FRg91TW_RCN0LTnj7gtF0WmuVdxQyXdRk8MAq5RVj-WxMrR_8TYaN9cK/exec';
const PROD_BBDD_URL = 'https://script.google.com/macros/s/AKfycbz8LoeGw2K7-afRKQMtsh6BY1GpOGF3SR2ehLHiNjOzmM0y5WmjWvw0Go_PoJ9jhC71/exec';

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
    // En desarrollo podemos usar fetch directamente gracias al proxy
    if (isLocalhost) {
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
    }
    
    // En producción, abrir ventana auxiliar para evitar CORS
    else {
      return new Promise((resolve) => {
        const popup = window.open('', '_blank', 'width=500,height=400');
        
        if (popup) {
          popup.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Enviando datos...</title>
              <style>
                body { font-family: Arial; padding: 20px; text-align: center; background: #f0f0f0; }
                .card { background: white; max-width: 450px; margin: 30px auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h3 { color: #2196F3; }
                .status { padding: 15px; margin: 15px 0; border-radius: 5px; }
                .sending { background: #e3f2fd; border: 1px solid #2196f3; }
                .success { background: #e8f5e9; border: 1px solid #4caf50; }
                .error { background: #ffebee; border: 1px solid #f44336; }
                pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; font-size: 11px; text-align: left; }
              </style>
            </head>
            <body>
              <div class="card">
                <h3>📤 Enviando datos a la base</h3>
                <div class="status sending" id="statusMsg">
                  Preparando ${datos.data?.length || 0} registros...
                </div>
                
                <div id="response"></div>
                
                <p><small>Esta ventana se cerrará automáticamente</small></p>
                
                <script>
                  // Función para actualizar el estado
                  function updateStatus(message, type) {
                    const statusEl = document.getElementById('statusMsg');
                    statusEl.innerHTML = message;
                    statusEl.className = 'status ' + (type || 'sending');
                  }
                  
                  // Datos a enviar
                  const datosJSON = ${JSON.stringify(JSON.stringify(datos))};
                  
                  updateStatus("Enviando ${datos.data?.length || 0} registros...");
                  
                  // Usar fetch con método POST y cuerpo JSON
                  fetch('${PROD_BBDD_URL}', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: datosJSON
                  })
                  .then(response => response.json())
                  .then(data => {
                    // Éxito
                    updateStatus("✅ Datos enviados correctamente: " + (data.registros || 0) + " registros", "success");
                    document.getElementById('response').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    
                    // Cerrar ventana después de 4 segundos
                    setTimeout(() => window.close(), 4000);
                  })
                  .catch(error => {
                    // Error
                    updateStatus("❌ Error al enviar datos: " + error.message, "error");
                    
                    // No cerrar automáticamente en caso de error
                    document.getElementById('response').innerHTML = '<pre>Error: ' + error + '</pre>';
                  });
                </script>
              </div>
            </body>
            </html>
          `);
          
          popup.document.close();
          
          // Devolver resultado inmediatamente para que la interfaz siga respondiendo
          resolve({
            success: true, 
            message: `✅ Datos enviados (${datos.data?.length || 0} registros)`,
            note: 'Se completará en unos segundos'
          });
        } else {
          // Fallback si popup bloqueado
          alert("📢 Se bloqueó la ventana emergente. Habilite ventanas emergentes para este sitio.");
          
          resolve({
            success: false,
            message: "Se bloqueó la ventana emergente. Por favor habilite las ventanas emergentes para este sitio."
          });
        }
      });
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Error: ${error.message}`
    };
  }
};