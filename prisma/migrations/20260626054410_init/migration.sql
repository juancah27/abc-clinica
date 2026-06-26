-- CreateEnum
CREATE TYPE "RolEmpleado" AS ENUM ('MEDICO', 'ENFERMERA', 'ADMINISTRATIVO', 'TECNICO', 'LIMPIEZA', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoGastoGeneral" AS ENUM ('ALQUILER', 'DEPRECIACION', 'SUMINISTROS', 'SERVICIOS', 'SEGUROS', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoInductor" AS ENUM ('TIEMPO_MINUTOS', 'CANTIDAD_PACIENTES', 'METROS_CUADRADOS', 'NUMERO_EQUIPOS', 'HORAS_MAQUINA', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CategoriaActividad" AS ENUM ('CLINICA_DIRECTA', 'CLINICA_APOYO', 'OPERATIVA', 'ADMINISTRATIVA');

-- CreateEnum
CREATE TYPE "PeriodoFrecuencia" AS ENUM ('MENSUAL', 'TRIMESTRAL', 'ANUAL');

-- CreateTable
CREATE TABLE "Departamento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "rol" "RolEmpleado" NOT NULL,
    "departamentoId" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstructuraCompensacion" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "salarioBase" DECIMAL(12,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "horasSemanales" DECIMAL(5,2) NOT NULL,
    "semanasAnuales" INTEGER NOT NULL DEFAULT 48,
    "porcentajeBeneficios" DECIMAL(5,2) NOT NULL,
    "vigenteDesde" TIMESTAMP(3) NOT NULL,
    "vigenteHasta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstructuraCompensacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficio" (
    "id" TEXT NOT NULL,
    "compensacionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "montoAnual" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostoHoraCalculado" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "costoHora" DECIMAL(10,4) NOT NULL,
    "horasAnuales" DECIMAL(8,2) NOT NULL,
    "costoAnualTotal" DECIMAL(14,2) NOT NULL,
    "calculadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostoHoraCalculado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CentroCosto" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CentroCosto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GastoGeneral" (
    "id" TEXT NOT NULL,
    "centroCostoId" TEXT NOT NULL,
    "tipo" "TipoGastoGeneral" NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "frecuencia" "PeriodoFrecuencia" NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GastoGeneral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivoDepreciable" (
    "id" TEXT NOT NULL,
    "centroCostoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valorAdquisicion" DECIMAL(14,2) NOT NULL,
    "valorResidual" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "vidaUtilMeses" INTEGER NOT NULL,
    "fechaAdquisicion" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivoDepreciable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepreciacionMensual" (
    "id" TEXT NOT NULL,
    "activoId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "DepreciacionMensual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" "CategoriaActividad" NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecursoActividad" (
    "id" TEXT NOT NULL,
    "actividadId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costoUnitario" DECIMAL(10,2) NOT NULL,
    "unidad" TEXT NOT NULL DEFAULT 'unidad',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecursoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionRecursoActividad" (
    "id" TEXT NOT NULL,
    "actividadId" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "minutosPorEjecucion" DECIMAL(8,2) NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionRecursoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inductor" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoInductor" NOT NULL,
    "unidad" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inductor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InductorActividad" (
    "id" TEXT NOT NULL,
    "inductorId" TEXT NOT NULL,
    "actividadId" TEXT NOT NULL,
    "centroCostoId" TEXT,
    "pesoAsignacion" DECIMAL(5,2) NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InductorActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EjecucionActividad" (
    "id" TEXT NOT NULL,
    "actividadId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "volumen" DECIMAL(12,2) NOT NULL,
    "notas" TEXT,
    "registradoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EjecucionActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultadoCosteo" (
    "id" TEXT NOT NULL,
    "actividadId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "costoDirectoPersonal" DECIMAL(14,2) NOT NULL,
    "costoOverhead" DECIMAL(14,2) NOT NULL,
    "costoMateriales" DECIMAL(14,2) NOT NULL,
    "costoTotal" DECIMAL(14,2) NOT NULL,
    "costoUnitario" DECIMAL(14,4) NOT NULL,
    "volumen" DECIMAL(12,2) NOT NULL,
    "margenReferencia" DECIMAL(14,2),
    "calculadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultadoCosteo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_nombre_key" ON "Departamento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_codigo_key" ON "Empleado"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "EstructuraCompensacion_empleadoId_key" ON "EstructuraCompensacion"("empleadoId");

-- CreateIndex
CREATE UNIQUE INDEX "CostoHoraCalculado_empleadoId_periodo_key" ON "CostoHoraCalculado"("empleadoId", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "CentroCosto_codigo_key" ON "CentroCosto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "DepreciacionMensual_activoId_periodo_key" ON "DepreciacionMensual"("activoId", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_codigo_key" ON "Actividad"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionRecursoActividad_actividadId_empleadoId_key" ON "AsignacionRecursoActividad"("actividadId", "empleadoId");

-- CreateIndex
CREATE UNIQUE INDEX "Inductor_codigo_key" ON "Inductor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "InductorActividad_inductorId_actividadId_key" ON "InductorActividad"("inductorId", "actividadId");

-- CreateIndex
CREATE INDEX "EjecucionActividad_actividadId_periodo_idx" ON "EjecucionActividad"("actividadId", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "ResultadoCosteo_actividadId_periodo_key" ON "ResultadoCosteo"("actividadId", "periodo");
