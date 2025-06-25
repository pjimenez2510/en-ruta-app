import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFieldValidation } from '@/shared/hooks/use-field-validation';
import { ValidatedInput, ValidatedPasswordInput } from '@/shared/components';

// Ejemplo de formulario de registro usando el sistema de validación
const FormValidationExample = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // Definir campos requeridos
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
  const { 
    validateField, 
    validateFields, 
    areAllFieldsValid, 
    getFieldState,
    canEnableActionButton 
  } = useFieldValidation(requiredFields);

  // Validar campos cuando cambian
  useEffect(() => {
    validateField('firstName', formData.firstName);
  }, [formData.firstName, validateField]);

  useEffect(() => {
    validateField('lastName', formData.lastName);
  }, [formData.lastName, validateField]);

  useEffect(() => {
    validateField('email', formData.email);
  }, [formData.email, validateField]);

  useEffect(() => {
    validateField('password', formData.password);
  }, [formData.password, validateField]);

  useEffect(() => {
    validateField('confirmPassword', formData.confirmPassword);
  }, [formData.confirmPassword, validateField]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const isValid = validateFields(formData);
    
    if (isValid) {
      console.log('Formulario válido, enviando datos:', formData);
      // Aquí iría la lógica para enviar el formulario
    } else {
      console.log('Formulario inválido');
    }
  };

  const canSubmit = canEnableActionButton();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ejemplo de Formulario con Validación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidatedInput
            id="firstName"
            label="Nombre"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            required={true}
            showAsterisk={getFieldState('firstName').showAsterisk}
            placeholder="Ingresa tu nombre"
          />

          <ValidatedInput
            id="lastName"
            label="Apellido"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            required={true}
            showAsterisk={getFieldState('lastName').showAsterisk}
            placeholder="Ingresa tu apellido"
          />

          <ValidatedInput
            id="email"
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            required={true}
            showAsterisk={getFieldState('email').showAsterisk}
            placeholder="ejemplo@correo.com"
          />

          <ValidatedPasswordInput
            id="password"
            label="Contraseña"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            required={true}
            showAsterisk={getFieldState('password').showAsterisk}
            placeholder="********"
          />

          <ValidatedPasswordInput
            id="confirmPassword"
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            required={true}
            showAsterisk={getFieldState('confirmPassword').showAsterisk}
            placeholder="********"
          />

          <ValidatedInput
            id="phone"
            label="Teléfono (opcional)"
            type="tel"
            value={formData.phone}
            onChange={(value) => handleInputChange('phone', value)}
            required={false}
            showAsterisk={false}
            placeholder="+1234567890"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit}
          >
            {canSubmit ? 'Enviar Formulario' : 'Completa los campos requeridos'}
          </Button>

          {!canSubmit && (
            <p className="text-sm text-red-500 text-center">
              Completa todos los campos marcados con * para continuar
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default FormValidationExample; 