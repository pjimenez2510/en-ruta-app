
import { User, SRIResponse } from "@/core/interfaces/management-users.interface";

const SRI_API_URL = "https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion";

export const getUsersFromStorage = (): User[] => {
  try {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  } catch {
    return [];
  }
};

export const saveUsersToStorage = (users: User[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
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
    throw new Error("Error al buscar la información" + error);
  }
}; 