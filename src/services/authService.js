// URLs para el servicio de autenticación
const PROD_AUTH_URL = '/gs/macros/s/AKfycbwonoRqXNLNc-uOUrBKZrLIPbJlXHfL8V5e4smoq5wPwlzBjb4P0OGQJTjSEpoYZJ9rtw/exec';
const DEV_AUTH_URL = '/gs/macros/s/AKfycbwonoRqXNLNc-uOUrBKZrLIPbJlXHfL8V5e4smoq5wPwlzBjb4P0OGQJTjSEpoYZJ9rtw/exec';

// Determina si estamos en localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL final según el entorno
const AUTH_URL = isLocalhost ? DEV_AUTH_URL : PROD_AUTH_URL;

// Lista de respaldo en caso de fallo de la API
const BACKUP_EMAILS = [
  'pablomartin.gatica@newsan.com.ar',
  'adriana.venialgo@newsan.com.ar',
  'romina.morales@newsan.com.ar'
  // Puedes incluir algunos emails críticos aquí
];

/**
 * Obtiene la lista de emails autorizados desde Google Sheets
 * @returns {Promise<string[]>} - Lista de emails autorizados
 */
export const getAuthorizedEmails = async () => {
  try {
    const response = await fetch(AUTH_URL);
    
    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', response.status);
      return BACKUP_EMAILS;
    }
    
    const data = await response.json();
    
    // Verificar que los datos tengan el formato esperado
    if (Array.isArray(data)) {
      return data.map(email => email.toLowerCase().trim());
    } else if (data.emails && Array.isArray(data.emails)) {
      return data.emails.map(email => email.toLowerCase().trim());
    } else {
      console.error('Formato de respuesta inesperado:', data);
      return BACKUP_EMAILS;
    }
  } catch (error) {
    console.error('Error al obtener emails autorizados:', error);
    return BACKUP_EMAILS;
  }
};