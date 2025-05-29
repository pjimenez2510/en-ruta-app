import { User, SRIResponse } from "../interfaces/management-users.interface";

const SRI_API_URL = "https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion";

export const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return [];
  const savedUsers = localStorage.getItem('users');
  return savedUsers ? JSON.parse(savedUsers) : [];
};

export const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const fetchSRIData = async (cedula: string): Promise<string> => {
  try {
    const response = await fetch(`${SRI_API_URL}/${cedula}`);
    const data: SRIResponse = await response.json();
    
    if (!data.contribuyente?.nombreComercial) {
      throw new Error("No se encontró información para esta cédula");
    }
    
    return data.contribuyente.nombreComercial;
  } catch (error) {
    throw new Error("Error al buscar la información");
  }
}; 