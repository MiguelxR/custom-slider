
export const getArrayValues = async ()  => {

    const getArrayValuesEndpoint = 'getArrayValues';

    const rangeUrl = process.env.NEXT_PUBLIC_API_RANGE_URL + getArrayValuesEndpoint;

    if (!rangeUrl) {
        throw new Error("La URL de la API no está definida en las variables de entorno.");
    }
  
    try {
        const response = await fetch(rangeUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.statusText}`);
        }
    
        const data = await response.json();
        return data;
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(`Error al obtener el rango: ${err.message}`);
        } else {
          throw new Error('Error al obtener el rango: Error desconocido');
        }
      }
}