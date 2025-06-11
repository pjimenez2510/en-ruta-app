"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Calendar, FileText, Save, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CrearResolucionPage() {
  const [formData, setFormData] = useState({
    numeroResolucion: "",
    fechaEmision: "",
    fechaVigencia: "",
    descripcion: "",
    activo: true,
  })
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo (solo PDF)
      if (file.type !== "application/pdf") {
        setErrors((prev: any) => ({ ...prev, documento: "Solo se permiten archivos PDF" }))
        return
      }
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev: any) => ({ ...prev, documento: "El archivo no puede ser mayor a 10MB" }))
        return
      }
      setDocumentFile(file)
      setErrors((prev: any) => ({ ...prev, documento: null }))
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.numeroResolucion.trim()) {
      newErrors.numeroResolucion = "El número de resolución es obligatorio"
    }

    if (!formData.fechaEmision) {
      newErrors.fechaEmision = "La fecha de emisión es obligatoria"
    }

    if (formData.fechaVigencia && new Date(formData.fechaVigencia) <= new Date(formData.fechaEmision)) {
      newErrors.fechaVigencia = "La fecha de vigencia debe ser posterior a la fecha de emisión"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envío de datos
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aquí iría la lógica real de envío
      console.log("Datos del formulario:", formData)
      console.log("Archivo:", documentFile)

      // Redirigir a la lista de resoluciones
      window.location.href = "/main/resolution"
    } catch (error) {
      console.error("Error al crear resolución:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <a href="/main/resolution">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Resolución ANT</h1>
              <p className="text-gray-500">Crear una nueva resolución de la Agencia Nacional de Tránsito</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información Básica
                </CardTitle>
                <CardDescription>Datos principales de la resolución</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroResolucion">
                    Número de Resolución <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="numeroResolucion"
                    placeholder="Ej: ANT-2025-001"
                    value={formData.numeroResolucion}
                    onChange={(e) => handleInputChange("numeroResolucion", e.target.value)}
                    className={errors.numeroResolucion ? "border-red-500" : ""}
                  />
                  {errors.numeroResolucion && <p className="text-sm text-red-500">{errors.numeroResolucion}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fechaEmision">
                      Fecha de Emisión <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fechaEmision"
                      type="date"
                      value={formData.fechaEmision}
                      onChange={(e) => handleInputChange("fechaEmision", e.target.value)}
                      className={errors.fechaEmision ? "border-red-500" : ""}
                    />
                    {errors.fechaEmision && <p className="text-sm text-red-500">{errors.fechaEmision}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaVigencia">Fecha de Vigencia</Label>
                    <Input
                      id="fechaVigencia"
                      type="date"
                      value={formData.fechaVigencia}
                      onChange={(e) => handleInputChange("fechaVigencia", e.target.value)}
                      className={errors.fechaVigencia ? "border-red-500" : ""}
                    />
                    {errors.fechaVigencia && <p className="text-sm text-red-500">{errors.fechaVigencia}</p>}
                    <p className="text-xs text-gray-500">Opcional. Fecha hasta la cual es válida la resolución</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Descripción detallada de la resolución..."
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Opcional. Descripción del contenido de la resolución</p>
                </div>
              </CardContent>
            </Card>

            {/* Documento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Documento de la Resolución
                </CardTitle>
                <CardDescription>Subir el archivo PDF de la resolución oficial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">Archivo PDF</Label>
                  <Input
                    id="documento"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className={errors.documento ? "border-red-500" : ""}
                  />
                  {errors.documento && <p className="text-sm text-red-500">{errors.documento}</p>}
                  {documentFile && <p className="text-sm text-green-600">Archivo seleccionado: {documentFile.name}</p>}
                  <p className="text-xs text-gray-500">
                    Opcional. Solo archivos PDF, máximo 10MB. El documento será almacenado de forma segura.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estado */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de la Resolución</CardTitle>
                <CardDescription>Configurar el estado inicial de la resolución</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => handleInputChange("activo", checked)}
                  />
                  <Label htmlFor="activo">Resolución activa</Label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Las resoluciones activas están disponibles para su uso en el sistema. Las inactivas no se pueden
                  utilizar.
                </p>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota:</strong> Una vez creada la resolución, podrás editarla en cualquier momento. El número de
                resolución debe ser único en el sistema.
              </AlertDescription>
            </Alert>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <a href="/main/resolution">Cancelar</a>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  "Creando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear Resolución
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
