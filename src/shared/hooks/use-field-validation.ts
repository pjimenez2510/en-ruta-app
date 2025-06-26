import { useState, useCallback } from 'react';

interface FieldValidationState {
  [key: string]: {
    isValid: boolean;
    hasValue: boolean;
    showAsterisk: boolean;
  };
}

export const useFieldValidation = (requiredFields: string[]) => {
  // Inicializar el estado solo una vez
  const [fieldStates, setFieldStates] = useState<FieldValidationState>(() => {
    const initialStates: FieldValidationState = {};
    requiredFields.forEach(fieldName => {
      initialStates[fieldName] = {
        isValid: false,
        hasValue: false,
        showAsterisk: true,
      };
    });
    return initialStates;
  });

  // ✅ SOLUCIÓN: Memorizar validateField con useCallback
  const validateField = useCallback((fieldName: string, value: unknown) => {
    const hasValue = value !== null && value !== undefined && value !== '';
    const isValid = hasValue && String(value).trim().length > 0;
        
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        isValid,
        hasValue,
        showAsterisk: !isValid, // Mostrar asterisco solo si no es válido
      },
    }));

    return isValid;
  }, []); // Array vacío porque no depende de ningún valor externo

  // ✅ También memorizar validateFields
  const validateFields = useCallback((fields: { [key: string]: unknown }) => {
    setFieldStates(prev => {
      const newStates = { ...prev };

      Object.keys(fields).forEach(fieldName => {
        if (requiredFields.includes(fieldName)) {
          const fieldValue = fields[fieldName];
          const hasValue = fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
          const isValid = hasValue && String(fieldValue).trim().length > 0;
                  
          newStates[fieldName] = {
            isValid,
            hasValue,
            showAsterisk: !isValid,
          };
        }
      });

      return newStates;
    });
  }, [requiredFields]);

  // Función para verificar si todos los campos requeridos son válidos
  const areAllFieldsValid = useCallback(() => {
    return Object.values(fieldStates).every(state => state.isValid);
  }, [fieldStates]);

  // Función para verificar si hay asteriscos activos (campos requeridos sin completar)
  const hasActiveAsterisks = useCallback(() => {
    return Object.values(fieldStates).some(state => state.showAsterisk);
  }, [fieldStates]);

  // Función para obtener el estado de un campo específico
  const getFieldState = useCallback((fieldName: string) => {
    return fieldStates[fieldName] || { isValid: false, hasValue: false, showAsterisk: true };
  }, [fieldStates]);

  // Función para verificar si se puede habilitar el botón de acción
  const canEnableActionButton = useCallback(() => {
    return !hasActiveAsterisks() && areAllFieldsValid();
  }, [hasActiveAsterisks, areAllFieldsValid]);

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