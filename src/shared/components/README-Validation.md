# Sistema de Validación de Campos Requeridos

Este sistema proporciona una solución reutilizable para validar campos requeridos con asteriscos rojos que desaparecen cuando el campo tiene un valor válido, y deshabilita botones de acción cuando hay campos requeridos sin completar.

## Componentes Disponibles

### 1. `RequiredLabel`
Componente de etiqueta que muestra un asterisco rojo cuando el campo es requerido y no tiene valor válido.

```tsx
import { RequiredLabel } from '@/shared/components';

<RequiredLabel
  htmlFor="username"
  required={true}
  showAsterisk={true}
>
  Nombre de usuario
</RequiredLabel>
```

### 2. `ValidatedInput`
Componente de input que incluye validación y asterisco rojo para campos requeridos.

```tsx
import { ValidatedInput } from '@/shared/components';

<ValidatedInput
  id="username"
  label="Nombre de usuario"
  value={username}
  onChange={setUsername}
  required={true}
  showAsterisk={usernameState.showAsterisk}
  placeholder="Ingresa tu usuario"
/>
```

### 3. `ValidatedPasswordInput`
Componente de password input con toggle para mostrar/ocultar contraseña y validación.

```tsx
import { ValidatedPasswordInput } from '@/shared/components';

<ValidatedPasswordInput
  id="password"
  label="Contraseña"
  value={password}
  onChange={setPassword}
  required={true}
  showAsterisk={passwordState.showAsterisk}
  placeholder="********"
/>
```

## Hook de Validación

### `useFieldValidation`

Hook que maneja la lógica de validación de campos requeridos.

```tsx
import { useFieldValidation } from '@/shared/hooks/use-field-validation';

const requiredFields = ['username', 'password', 'email'];
const { 
  validateField, 
  validateFields, 
  areAllFieldsValid, 
  hasActiveAsterisks,
  canEnableActionButton,
  getFieldState 
} = useFieldValidation(requiredFields);
```

#### Métodos Disponibles:

- `validateField(fieldName, value)`: Valida un campo específico
- `validateFields(fieldsObject)`: Valida múltiples campos
- `areAllFieldsValid()`: Verifica si todos los campos requeridos son válidos
- `hasActiveAsterisks()`: Verifica si hay asteriscos activos (campos requeridos sin completar)
- `canEnableActionButton()`: Verifica si se puede habilitar el botón de acción
- `getFieldState(fieldName)`: Obtiene el estado de un campo específico

## Implementación Completa

### 1. Configurar el Hook

```tsx
const requiredFields = ['username', 'password'];
const { validateField, getFieldState, canEnableActionButton } = useFieldValidation(requiredFields);
```

### 2. Validar Campos en Tiempo Real

```tsx
useEffect(() => {
  validateField('username', username);
}, [username, validateField]);

useEffect(() => {
  validateField('password', password);
}, [password, validateField]);
```

### 3. Usar en el Formulario

```tsx
const usernameState = getFieldState('username');
const passwordState = getFieldState('password');
const canSubmit = canEnableActionButton();

<ValidatedInput
  id="username"
  label="Nombre de usuario"
  value={username}
  onChange={setUsername}
  required={true}
  showAsterisk={usernameState.showAsterisk}
/>

<ValidatedPasswordInput
  id="password"
  label="Contraseña"
  value={password}
  onChange={setPassword}
  required={true}
  showAsterisk={passwordState.showAsterisk}
/>
```

### 4. Controlar Botones de Acción

```tsx
<Button
  type="submit"
  disabled={!canSubmit}
>
  {canSubmit ? 'Iniciar Sesión' : 'Completa los campos requeridos'}
</Button>

{!canSubmit && (
  <p className="text-sm text-red-500 text-center">
    Completa todos los campos requeridos para continuar
  </p>
)}
```

### 5. Validar al Enviar

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const isValid = validateFields({
    username,
    password
  });
  
  if (isValid) {
    // Enviar formulario
  }
};
```

## Características

- ✅ Asteriscos rojos que desaparecen cuando el campo tiene valor válido
- ✅ Validación en tiempo real
- ✅ **Botones de acción deshabilitados cuando hay asteriscos activos**
- ✅ **Mensajes informativos cuando el formulario no se puede enviar**
- ✅ Reutilizable en múltiples formularios
- ✅ Soporte para campos opcionales
- ✅ Integración con React Hook Form (opcional)
- ✅ Componentes TypeScript con tipado completo
- ✅ Estilos consistentes con el sistema de diseño

## Ejemplo de Uso en Otros Formularios

Ver `FormValidationExample.tsx` para un ejemplo completo de implementación en un formulario de registro.

## Flujo de Validación

1. **Inicialización**: Todos los campos requeridos muestran asteriscos rojos
2. **Validación en tiempo real**: Los asteriscos desaparecen cuando el usuario ingresa valores válidos
3. **Control de botones**: Los botones de acción se habilitan solo cuando todos los campos requeridos están completos
4. **Feedback visual**: Mensajes informativos guían al usuario sobre qué campos necesita completar

## Notas Importantes

1. Los asteriscos solo se muestran para campos marcados como `required={true}`
2. La validación considera un campo válido cuando tiene contenido (no está vacío, null o undefined)
3. El hook se inicializa automáticamente con todos los campos requeridos mostrando asteriscos
4. Los componentes son completamente reutilizables y no dependen de React Hook Form
5. **Los botones de acción se deshabilitan automáticamente cuando hay campos requeridos sin completar**
6. **Se proporcionan mensajes informativos para guiar al usuario** 