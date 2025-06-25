import { useState, useEffect } from 'react';

interface FieldValidationState {
  [key: string]: {
    isValid: boolean;
    hasValue: boolean;
    showAsterisk: boolean;
  };
}

export const useFieldValidation = (requiredFields: string[]) => {
  const [fieldStates, setFieldStates] = useState<FieldValidationState>({});

  // Inicializar estados de los campos requeridos
  useEffect(() => {
    const initialStates: FieldValidationState = {};
    requiredFields.forEach(fieldName => {
      initialStates[fieldName] = {
        isValid: false,
        hasValue: false,
        showAsterisk: true,
      };
    });
    setFieldStates(initialStates);
  }, [requiredFields]);

  // Función para validar un campo específico
  const validateField = (fieldName: string, value: any) => {
    const hasValue = value !== null && value !== undefined && value !== '';
    const isValid = hasValue && value.toString().trim().length > 0;
    
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        isValid,
        hasValue,
        showAsterisk: !isValid, // Mostrar asterisco solo si no es válido
      },
    }));

    return isValid;
  };

  // Función para validar múltiples campos
  const validateFields = (fields: { [key: string]: any }) => {
    const newStates = { ...fieldStates };
    let allValid = true;

    Object.keys(fields).forEach(fieldName => {
      if (requiredFields.includes(fieldName)) {
        const hasValue = fields[fieldName] !== null && fields[fieldName] !== undefined && fields[fieldName] !== '';
        const isValid = hasValue && fields[fieldName].toString().trim().length > 0;
        
        newStates[fieldName] = {
          isValid,
          hasValue,
          showAsterisk: !isValid,
        };

        if (!isValid) allValid = false;
      }
    });

    setFieldStates(newStates);
    return allValid;
  };

  // Función para verificar si todos los campos requeridos son válidos
  const areAllFieldsValid = () => {
    return Object.values(fieldStates).every(state => state.isValid);
  };

  // Función para verificar si hay asteriscos activos (campos requeridos sin completar)
  const hasActiveAsterisks = () => {
    return Object.values(fieldStates).some(state => state.showAsterisk);
  };

  // Función para obtener el estado de un campo específico
  const getFieldState = (fieldName: string) => {
    return fieldStates[fieldName] || { isValid: false, hasValue: false, showAsterisk: true };
  };

  // Función para verificar si se puede habilitar el botón de acción
  const canEnableActionButton = () => {
    return !hasActiveAsterisks() && areAllFieldsValid();
  };

  return {
    fieldStates,
    validateField,
    validateFields,
    areAllFieldsValid,
    hasActiveAsterisks,
    canEnableActionButton,
    getFieldState,
  };
}; 