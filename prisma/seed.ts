import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ABC Clinica...");

  // Clean existing data
  await prisma.resultadoCosteo.deleteMany();
  await prisma.ejecucionActividad.deleteMany();
  await prisma.inductorActividad.deleteMany();
  await prisma.inductor.deleteMany();
  await prisma.asignacionRecursoActividad.deleteMany();
  await prisma.recursoActividad.deleteMany();
  await prisma.costoHoraCalculado.deleteMany();
  await prisma.beneficio.deleteMany();
  await prisma.estructuraCompensacion.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.departamento.deleteMany();
  await prisma.depreciacionMensual.deleteMany();
  await prisma.activoDepreciable.deleteMany();
  await prisma.gastoGeneral.deleteMany();
  await prisma.centroCosto.deleteMany();
  await prisma.actividad.deleteMany();
  console.log("  ✓ Datos existentes limpiados");

  // 1. Departamentos
  const deptos = await Promise.all([
    prisma.departamento.create({
      data: { id: "dept-urgencias", nombre: "Urgencias", descripcion: "Servicio de urgencias y emergencias" },
    }),
    prisma.departamento.create({
      data: { id: "dept-quirofano", nombre: "Quirófano", descripcion: "Área quirúrgica y salas de operación" },
    }),
    prisma.departamento.create({
      data: { id: "dept-laboratorio", nombre: "Laboratorio", descripcion: "Análisis clínicos y diagnóstico" },
    }),
    prisma.departamento.create({
      data: { id: "dept-administracion", nombre: "Administración", descripcion: "Gestión administrativa y financiera" },
    }),
    prisma.departamento.create({
      data: { id: "dept-mantenimiento", nombre: "Mantenimiento", descripcion: "Mantenimiento de instalaciones y equipos" },
    }),
  ]);
  console.log(`  ✓ ${deptos.length} departamentos`);

  // 2. Centros de Costo
  const centrosCosto = await Promise.all([
    prisma.centroCosto.create({
      data: { id: "cc-instalaciones", codigo: "CC-001", nombre: "Instalaciones", descripcion: "Costos de infraestructura y espacio físico" },
    }),
    prisma.centroCosto.create({
      data: { id: "cc-equipos", codigo: "CC-002", nombre: "Equipos Médicos", descripcion: "Costos de equipamiento clínico" },
    }),
    prisma.centroCosto.create({
      data: { id: "cc-administracion", codigo: "CC-003", nombre: "Administración General", descripcion: "Costos administrativos generales" },
    }),
  ]);
  console.log(`  ✓ ${centrosCosto.length} centros de costo`);

  // 3. Empleados + Compensaciones + Beneficios
  const empleadosData = [
    {
      id: "emp-001", codigo: "EMP-001", nombreCompleto: "Dr. Carlos Méndez", rol: "MEDICO" as const,
      deptoId: "dept-urgencias", salario: 8500, horasSem: 40, beneficios: [
                    { nombre: "Seguro médico", montoAnual: 4800 },
                        { nombre: "Aguinaldo", montoAnual: 8500 },
                        { nombre: "Bonos", montoAnual: 6000 },
      ],
    },
    {
      id: "emp-002", codigo: "EMP-002", nombreCompleto: "Dra. Ana Ramírez", rol: "MEDICO" as const,
      deptoId: "dept-quirofano", salario: 9500, horasSem: 40, beneficios: [
                        { nombre: "Seguro médico", montoAnual: 4800 },
                        { nombre: "Aguinaldo", montoAnual: 9500 },
                        { nombre: "Bonos", montoAnual: 8000 },
      ],
    },
    {
      id: "emp-003", codigo: "EMP-003", nombreCompleto: "Lic. María Torres", rol: "ENFERMERA" as const,
      deptoId: "dept-urgencias", salario: 5200, horasSem: 36, beneficios: [
                        { nombre: "Seguro médico", montoAnual: 3600 },
                        { nombre: "Aguinaldo", montoAnual: 5200 },
      ],
    },
    {
      id: "emp-004", codigo: "EMP-004", nombreCompleto: "Enf. Roberto Sánchez", rol: "ENFERMERA" as const,
      deptoId: "dept-quirofano", salario: 5800, horasSem: 40, beneficios: [
                        { nombre: "Seguro médico", montoAnual: 3600 },
                        { nombre: "Aguinaldo", montoAnual: 5800 },
                        { nombre: "Bonos", montoAnual: 3000 },
      ],
    },
    {
      id: "emp-005", codigo: "EMP-005", nombreCompleto: "Tec. Laura Jiménez", rol: "TECNICO" as const,
      deptoId: "dept-laboratorio", salario: 4200, horasSem: 40, beneficios: [
                        { nombre: "Seguro médico", montoAnual: 3600 },
                        { nombre: "Aguinaldo", montoAnual: 4200 },
      ],
    },
    {
      id: "emp-006", codigo: "EMP-006", nombreCompleto: "Tec. Pedro Gómez", rol: "TECNICO" as const,
      deptoId: "dept-laboratorio", salario: 4000, horasSem: 40, beneficios: [
        { nombre: "Seguro médico", montoAnual: 3600 },
      ],
    },
    {
      id: "emp-007", codigo: "EMP-007", nombreCompleto: "Sra. Gloria Huerta", rol: "ADMINISTRATIVO" as const,
      deptoId: "dept-administracion", salario: 3800, horasSem: 40, beneficios: [
        { nombre: "Seguro médico", montoAnual: 3600 },
        { nombre: "Aguinaldo", montoAnual: 3800 },
      ],
    },
    {
      id: "emp-008", codigo: "EMP-008", nombreCompleto: "Sr. José Ruiz", rol: "LIMPIEZA" as const,
      deptoId: "dept-mantenimiento", salario: 2800, horasSem: 40, beneficios: [
        { nombre: "Seguro médico", montoAnual: 2400 },
        { nombre: "Aguinaldo", montoAnual: 2800 },
      ],
    },
  ];

  for (const e of empleadosData) {
    const empleado = await prisma.empleado.create({
      data: {
        id: e.id,
        codigo: e.codigo,
        nombreCompleto: e.nombreCompleto,
        rol: e.rol,
        departamentoId: e.deptoId,
        activo: true,
        fechaIngreso: new Date("2024-01-01"),
        compensacion: {
          create: {
            salarioBase: e.salario,
            horasSemanales: e.horasSem,
            semanasAnuales: 48,
            porcentajeBeneficios: 15,
            vigenteDesde: new Date("2024-01-01"),
            moneda: "USD",
            beneficios: {
              create: e.beneficios,
            },
          },
        },
      },
    });
    console.log(`  ✓ ${empleado.nombreCompleto}`);
  }

  // 4. Gastos Generales
  await Promise.all([
    prisma.gastoGeneral.create({
      data: {
        centroCostoId: "cc-instalaciones",
        tipo: "ALQUILER",
        concepto: "Renta mensual edificio clínica",
        monto: 15000,
        frecuencia: "MENSUAL",
        fechaInicio: new Date("2024-01-01"),
      },
    }),
    prisma.gastoGeneral.create({
      data: {
        centroCostoId: "cc-instalaciones",
        tipo: "SERVICIOS",
        concepto: "Electricidad, agua, internet",
        monto: 4500,
        frecuencia: "MENSUAL",
        fechaInicio: new Date("2024-01-01"),
      },
    }),
    prisma.gastoGeneral.create({
      data: {
        centroCostoId: "cc-instalaciones",
        tipo: "SEGUROS",
        concepto: "Seguro de responsabilidad civil",
        monto: 24000,
        frecuencia: "ANUAL",
        fechaInicio: new Date("2024-01-01"),
      },
    }),
    prisma.gastoGeneral.create({
      data: {
        centroCostoId: "cc-administracion",
        tipo: "SUMINISTROS",
        concepto: "Papelería y consumibles oficina",
        monto: 1200,
        frecuencia: "MENSUAL",
        fechaInicio: new Date("2024-01-01"),
      },
    }),
    prisma.gastoGeneral.create({
      data: {
        centroCostoId: "cc-administracion",
        tipo: "SERVICIOS",
        concepto: "Suscripciones software médico",
        monto: 3600,
        frecuencia: "ANUAL",
        fechaInicio: new Date("2024-01-01"),
      },
    }),
  ]);
  console.log("  ✓ 5 gastos generales");

  // 5. Activos Depreciables
  await Promise.all([
    prisma.activoDepreciable.create({
      data: {
        centroCostoId: "cc-equipos",
        nombre: "Monitor multiparamétrico",
        valorAdquisicion: 45000,
        valorResidual: 5000,
        vidaUtilMeses: 60,
        fechaAdquisicion: new Date("2023-06-01"),
        depreciaciones: {
          create: [
            { periodo: "2026-06", monto: 666.67 },
            { periodo: "2026-07", monto: 666.67 },
            { periodo: "2026-08", monto: 666.67 },
          ],
        },
      },
    }),
    prisma.activoDepreciable.create({
      data: {
        centroCostoId: "cc-equipos",
        nombre: "Equipo de rayos X digital",
        valorAdquisicion: 120000,
        valorResidual: 12000,
        vidaUtilMeses: 84,
        fechaAdquisicion: new Date("2023-01-01"),
        depreciaciones: {
          create: [
            { periodo: "2026-06", monto: 1285.71 },
            { periodo: "2026-07", monto: 1285.71 },
            { periodo: "2026-08", monto: 1285.71 },
          ],
        },
      },
    }),
    prisma.activoDepreciable.create({
      data: {
        centroCostoId: "cc-equipos",
        nombre: "Autoclave esterilización",
        valorAdquisicion: 28000,
        valorResidual: 2800,
        vidaUtilMeses: 48,
        fechaAdquisicion: new Date("2024-01-01"),
        depreciaciones: {
          create: [
            { periodo: "2026-06", monto: 525.00 },
            { periodo: "2026-07", monto: 525.00 },
            { periodo: "2026-08", monto: 525.00 },
          ],
        },
      },
    }),
  ]);
  console.log("  ✓ 3 activos depreciables");

  // 6. Actividades
  const actividadesData = [
    { id: "act-001", codigo: "ACT-001", nombre: "Triaje de Urgencias", categoria: "CLINICA_DIRECTA" as const, desc: "Clasificación inicial de pacientes por gravedad" },
    { id: "act-002", codigo: "ACT-002", nombre: "Consulta Médica General", categoria: "CLINICA_DIRECTA" as const, desc: "Atención médica general ambulatoria" },
    { id: "act-003", codigo: "ACT-003", nombre: "Cirugía Menor Ambulatoria", categoria: "CLINICA_DIRECTA" as const, desc: "Procedimientos quirúrgicos menores sin hospitalización" },
    { id: "act-004", codigo: "ACT-004", nombre: "Curación y Vendaje", categoria: "CLINICA_DIRECTA" as const, desc: "Atención de heridas y curación" },
    { id: "act-005", codigo: "ACT-005", nombre: "Toma de Muestras Lab", categoria: "CLINICA_APOYO" as const, desc: "Extracción de muestras para análisis" },
    { id: "act-006", codigo: "ACT-006", nombre: "Análisis Hematológico", categoria: "CLINICA_APOYO" as const, desc: "Exámenes de sangre y hematología" },
    { id: "act-007", codigo: "ACT-007", nombre: "Radiografía Simple", categoria: "CLINICA_APOYO" as const, desc: "Estudios radiológicos básicos" },
    { id: "act-008", codigo: "ACT-008", nombre: "Mantenimiento de Quirófano", categoria: "OPERATIVA" as const, desc: "Preparación y mantenimiento de sala quirúrgica" },
    { id: "act-009", codigo: "ACT-009", nombre: "Esterilización de Instrumental", categoria: "OPERATIVA" as const, desc: "Proceso de esterilización del instrumental médico" },
    { id: "act-010", codigo: "ACT-010", nombre: "Limpieza de Área Crítica", categoria: "OPERATIVA" as const, desc: "Limpieza y desinfección de áreas críticas" },
    { id: "act-011", codigo: "ACT-011", nombre: "Admisión de Paciente", categoria: "ADMINISTRATIVA" as const, desc: "Registro y admisión de pacientes" },
    { id: "act-012", codigo: "ACT-012", nombre: "Facturación y Cobro", categoria: "ADMINISTRATIVA" as const, desc: "Proceso de facturación y cobro a pacientes" },
    { id: "act-013", codigo: "ACT-013", nombre: "Gestión de Inventario", categoria: "ADMINISTRATIVA" as const, desc: "Control y gestión de inventario de insumos" },
    { id: "act-014", codigo: "ACT-014", nombre: "Monitoreo Preoperatorio", categoria: "CLINICA_DIRECTA" as const, desc: "Evaluación y monitoreo prequirúrgico" },
    { id: "act-015", codigo: "ACT-015", nombre: "Infusión IV y Medicación", categoria: "CLINICA_DIRECTA" as const, desc: "Administración de medicamentos intravenosos" },
  ];

  for (const a of actividadesData) {
    await prisma.actividad.create({
      data: {
        id: a.id,
        codigo: a.codigo,
        nombre: a.nombre,
        descripcion: a.desc,
        categoria: a.categoria,
        activa: true,
      },
    });
  }
  console.log(`  ✓ ${actividadesData.length} actividades`);

  // 7. Inductores
  const inductores = await Promise.all([
    prisma.inductor.create({
      data: { id: "ind-001", codigo: "IND-001", nombre: "Minutos de Personal", tipo: "TIEMPO_MINUTOS", unidad: "minutos", descripcion: "Tiempo invertido por el personal en cada actividad" },
    }),
    prisma.inductor.create({
      data: { id: "ind-002", codigo: "IND-002", nombre: "Pacientes Atendidos", tipo: "CANTIDAD_PACIENTES", unidad: "pacientes", descripcion: "Número de pacientes atendidos por actividad" },
    }),
    prisma.inductor.create({
      data: { id: "ind-003", codigo: "IND-003", nombre: "Metros Cuadrados Ocupados", tipo: "METROS_CUADRADOS", unidad: "m²", descripcion: "Espacio físico consumido por cada actividad" },
    }),
  ]);
  console.log(`  ✓ ${inductores.length} inductores`);

  // 8. InductorActividad (vínculos)
  await Promise.all([
    prisma.inductorActividad.create({ data: { inductorId: "ind-001", actividadId: "act-001", centroCostoId: null, pesoAsignacion: 100 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-001", actividadId: "act-002", centroCostoId: null, pesoAsignacion: 100 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-001", actividadId: "act-003", centroCostoId: null, pesoAsignacion: 100 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-001", actividadId: "act-004", centroCostoId: null, pesoAsignacion: 100 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-001", actividadId: "act-005", centroCostoId: null, pesoAsignacion: 100 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-001", actividadId: "act-006", centroCostoId: null, pesoAsignacion: 100 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-001", actividadId: "act-007", centroCostoId: null, pesoAsignacion: 100 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-002", actividadId: "act-001", centroCostoId: "cc-instalaciones", pesoAsignacion: 30 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-002", actividadId: "act-002", centroCostoId: "cc-instalaciones", pesoAsignacion: 25 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-002", actividadId: "act-003", centroCostoId: "cc-instalaciones", pesoAsignacion: 15 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-003", actividadId: "act-008", centroCostoId: "cc-instalaciones", pesoAsignacion: 50 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-003", actividadId: "act-009", centroCostoId: "cc-instalaciones", pesoAsignacion: 30 } }),
    prisma.inductorActividad.create({ data: { inductorId: "ind-003", actividadId: "act-010", centroCostoId: "cc-instalaciones", pesoAsignacion: 20 } }),
  ]);
  console.log("  ✓ 13 vínculos inductor-actividad");

  // 9. AsignacionRecursoActividad (personal a actividades)
  const asignaciones = [
    { actId: "act-001", empId: "emp-001", min: 12, principal: true },
    { actId: "act-001", empId: "emp-003", min: 15, principal: false },
    { actId: "act-002", empId: "emp-001", min: 25, principal: true },
    { actId: "act-003", empId: "emp-002", min: 90, principal: true },
    { actId: "act-003", empId: "emp-004", min: 90, principal: false },
    { actId: "act-004", empId: "emp-003", min: 15, principal: true },
    { actId: "act-005", empId: "emp-005", min: 8, principal: true },
    { actId: "act-006", empId: "emp-005", min: 20, principal: true },
    { actId: "act-006", empId: "emp-006", min: 20, principal: false },
    { actId: "act-007", empId: "emp-006", min: 10, principal: true },
    { actId: "act-008", empId: "emp-004", min: 45, principal: true },
    { actId: "act-009", empId: "emp-005", min: 30, principal: true },
    { actId: "act-010", empId: "emp-008", min: 25, principal: true },
    { actId: "act-011", empId: "emp-007", min: 10, principal: true },
    { actId: "act-012", empId: "emp-007", min: 12, principal: true },
    { actId: "act-013", empId: "emp-007", min: 60, principal: true },
    { actId: "act-014", empId: "emp-002", min: 20, principal: true },
    { actId: "act-014", empId: "emp-004", min: 20, principal: false },
    { actId: "act-015", empId: "emp-003", min: 18, principal: true },
  ];

  for (const a of asignaciones) {
    await prisma.asignacionRecursoActividad.create({
      data: {
        actividadId: a.actId,
        empleadoId: a.empId,
        minutosPorEjecucion: a.min,
        esPrincipal: a.principal,
      },
    });
  }
  console.log(`  ✓ ${asignaciones.length} asignaciones personal-actividad`);

  // 10. CostoHoraCalculado (para junio 2026)
  const costosHora = [
    { empId: "emp-001", costoHora: 52.08, horasAnuales: 1920, costoAnual: 100000 },
    { empId: "emp-002", costoHora: 57.29, horasAnuales: 1920, costoAnual: 110000 },
    { empId: "emp-003", costoHora: 33.46, horasAnuales: 1728, costoAnual: 57800 },
    { empId: "emp-004", costoHora: 36.88, horasAnuales: 1920, costoAnual: 70800 },
    { empId: "emp-005", costoHora: 27.08, horasAnuales: 1920, costoAnual: 52000 },
    { empId: "emp-006", costoHora: 25.00, horasAnuales: 1920, costoAnual: 48000 },
    { empId: "emp-007", costoHora: 24.48, horasAnuales: 1920, costoAnual: 47000 },
    { empId: "emp-008", costoHora: 18.23, horasAnuales: 1920, costoAnual: 35000 },
  ];

  for (const c of costosHora) {
    await prisma.costoHoraCalculado.create({
      data: {
        empleadoId: c.empId,
        periodo: "2026-06",
        costoHora: c.costoHora,
        horasAnuales: c.horasAnuales,
        costoAnualTotal: c.costoAnual,
      },
    });
  }
  console.log("  ✓ 8 costos/hora calculados");

  // 11. EjecucionActividad (volumen junio 2026)
  const ejecuciones = [
    { actId: "act-001", volumen: 420, notas: "Promedio mensual urgencias" },
    { actId: "act-002", volumen: 350, notas: "Consultas generales" },
    { actId: "act-003", volumen: 45, notas: "Cirugías menores programadas" },
    { actId: "act-004", volumen: 180, notas: "Curaciones programadas y de urgencia" },
    { actId: "act-005", volumen: 500, notas: "Tomas de muestra" },
    { actId: "act-006", volumen: 380, notas: "Análisis procesados" },
    { actId: "act-007", volumen: 200, notas: "Radiografías realizadas" },
    { actId: "act-008", volumen: 60, notas: "Mantenimientos programados" },
    { actId: "act-009", volumen: 120, notas: "Ciclos de esterilización" },
    { actId: "act-010", volumen: 90, notas: "Limpiezas profundas" },
    { actId: "act-011", volumen: 550, notas: "Pacientes admitidos" },
    { actId: "act-012", volumen: 520, notas: "Facturas procesadas" },
    { actId: "act-013", volumen: 40, notas: "Revisiones de inventario" },
    { actId: "act-014", volumen: 120, notas: "Pacientes monitoreados" },
    { actId: "act-015", volumen: 250, notas: "Infusiones administradas" },
  ];

  for (const e of ejecuciones) {
    await prisma.ejecucionActividad.create({
      data: {
        actividadId: e.actId,
        periodo: "2026-06",
        volumen: e.volumen,
        notas: e.notas,
      },
    });
  }
  console.log(`  ✓ ${ejecuciones.length} ejecuciones registradas`);

  // 12. ResultadoCosteo (cálculo ABC inicial para junio 2026)
  const resultados = [
    { actId: "act-001", costoDirecto: 4500.00, costoOverhead: 3200.00, costoMateriales: 850.00, volumen: 420 },
    { actId: "act-002", costoDirecto: 5800.00, costoOverhead: 2800.00, costoMateriales: 600.00, volumen: 350 },
    { actId: "act-003", costoDirecto: 8900.00, costoOverhead: 4500.00, costoMateriales: 3200.00, volumen: 45 },
    { actId: "act-004", costoDirecto: 2100.00, costoOverhead: 1200.00, costoMateriales: 950.00, volumen: 180 },
    { actId: "act-005", costoDirecto: 1800.00, costoOverhead: 1500.00, costoMateriales: 2200.00, volumen: 500 },
    { actId: "act-006", costoDirecto: 3200.00, costoOverhead: 1800.00, costoMateriales: 3800.00, volumen: 380 },
    { actId: "act-007", costoDirecto: 1500.00, costoOverhead: 2200.00, costoMateriales: 1800.00, volumen: 200 },
    { actId: "act-008", costoDirecto: 2800.00, costoOverhead: 1600.00, costoMateriales: 400.00, volumen: 60 },
    { actId: "act-009", costoDirecto: 1800.00, costoOverhead: 900.00, costoMateriales: 600.00, volumen: 120 },
    { actId: "act-010", costoDirecto: 1200.00, costoOverhead: 800.00, costoMateriales: 350.00, volumen: 90 },
    { actId: "act-011", costoDirecto: 1500.00, costoOverhead: 1200.00, costoMateriales: 200.00, volumen: 550 },
    { actId: "act-012", costoDirecto: 1800.00, costoOverhead: 1400.00, costoMateriales: 300.00, volumen: 520 },
    { actId: "act-013", costoDirecto: 2600.00, costoOverhead: 600.00, costoMateriales: 150.00, volumen: 40 },
    { actId: "act-014", costoDirecto: 3800.00, costoOverhead: 2100.00, costoMateriales: 1200.00, volumen: 120 },
    { actId: "act-015", costoDirecto: 2800.00, costoOverhead: 1800.00, costoMateriales: 2500.00, volumen: 250 },
  ];

  for (const r of resultados) {
    const costoTotal = r.costoDirecto + r.costoOverhead + r.costoMateriales;
    const costoUnitario = costoTotal / r.volumen;
    await prisma.resultadoCosteo.create({
      data: {
        actividadId: r.actId,
        periodo: "2026-06",
        costoDirectoPersonal: r.costoDirecto,
        costoOverhead: r.costoOverhead,
        costoMateriales: r.costoMateriales,
        costoTotal,
        costoUnitario,
        volumen: r.volumen,
        margenReferencia: null,
      },
    });
  }
  console.log(`  ✓ ${resultados.length} resultados de costeo`);

  console.log("\n✅ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
