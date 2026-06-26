export interface ResultadoCosto {
  actividadId: string;
  actividadNombre: string;
  categoria: string;
  costoDirectoPersonal: number;
  costoOverhead: number;
  costoMateriales: number;
  costoTotal: number;
  costoUnitario: number;
  volumen: number;
}

export interface ResumenCosteo {
  periodo: string;
  totalCostos: number;
  totalDirecto: number;
  totalOverhead: number;
  totalMateriales: number;
  costoPromedioUnitario: number;
  actividades: ResultadoCosto[];
  calculadoEn: Date;
}

export interface PoolOverhead {
  centroCostoId: string;
  centroCostoNombre: string;
  totalGastos: number;
  totalDepreciacion: number;
  totalPool: number;
}

export interface TasaInductor {
  inductorId: string;
  inductorNombre: string;
  totalPool: number;
  volumenTotal: number;
  tasa: number;
}
