# Mock Data for Improved Database Schema

## Roles

```json
[
  {
    "id": "role_1",
    "tipo_rol": "Médico Jefe",
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "role_2",
    "tipo_rol": "Residente",
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "role_3",
    "tipo_rol": "Enfermero",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

## Médicos

```json
[
  {
    "id": "med_1",
    "rol_id": "role_1",
    "nombre": "Juan",
    "apellido": "Pérez",
    "activo": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "med_2",
    "rol_id": "role_2",
    "nombre": "María",
    "apellido": "García",
    "activo": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "med_3",
    "rol_id": "role_3",
    "nombre": "Carlos",
    "apellido": "López",
    "activo": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

## Camas

```json
[
  {
    "id": "cama_1",
    "numero": "101",
    "sala": "UTI-1",
    "ocupada": true,
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "cama_2",
    "numero": "102",
    "sala": "UTI-1",
    "ocupada": true,
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "cama_3",
    "numero": "103",
    "sala": "UTI-1",
    "ocupada": false,
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

## Pacientes

```json
[
  {
    "id": "pac_1",
    "nombre": "Ana",
    "apellido": "Rodríguez",
    "cama": "cama_1",
    "motivo_ingreso": "Neumonía severa",
    "activo": true,
    "fecha_ingreso": "2025-08-25T10:00:00Z",
    "fecha_alta": null,
    "created_at": "2025-08-25T10:00:00Z",
    "updated_at": "2025-08-25T10:00:00Z"
  },
  {
    "id": "pac_2",
    "nombre": "Luis",
    "apellido": "Martínez",
    "cama": "cama_2",
    "motivo_ingreso": "Sepsis abdominal",
    "activo": true,
    "fecha_ingreso": "2025-08-20T14:30:00Z",
    "fecha_alta": null,
    "created_at": "2025-08-20T14:30:00Z",
    "updated_at": "2025-08-20T14:30:00Z"
  },
  {
    "id": "pac_3",
    "nombre": "Elena",
    "apellido": "Sánchez",
    "cama": null,
    "motivo_ingreso": "Insuficiencia respiratoria",
    "activo": false,
    "fecha_ingreso": "2025-08-15T08:00:00Z",
    "fecha_alta": "2025-08-30T16:00:00Z",
    "created_at": "2025-08-15T08:00:00Z",
    "updated_at": "2025-08-30T16:00:00Z"
  }
]
```

## Pases

```json
[
  {
    "id": "pase_1",
    "paciente_id": "pac_1",
    "medico_id": "med_1",
    "principal": "Neumonía nosocomial",
    "antecedentes": "Paciente con historia de EPOC",
    "gcs_rass": "15/0",
    "cultivos_id": "cult_1",
    "atb": "Ceftriaxona 2g/24h",
    "vc_cook": "Normal",
    "actualmente": "Estable, afebril",
    "pendientes": "Control gases arteriales",
    "fecha_creacion": "2025-08-30T14:30:00Z",
    "fecha_modificacion": "2025-08-30T14:30:00Z"
  },
  {
    "id": "pase_2",
    "paciente_id": "pac_2",
    "medico_id": "med_2",
    "principal": "Sepsis abdominal",
    "antecedentes": "Postoperatorio apendicectomía",
    "gcs_rass": "15/0",
    "cultivos_id": "cult_2",
    "atb": "Piperacilina/Tazobactam",
    "vc_cook": "Elevado",
    "actualmente": "Mejoría clínica",
    "pendientes": "Retiro drenaje",
    "fecha_creacion": "2025-08-30T16:45:00Z",
    "fecha_modificacion": "2025-08-30T16:45:00Z"
  }
]
```

## Cultivos

```json
[
  {
    "id": "cult_1",
    "pase_id": "pase_1",
    "fecha_solicitud": "2025-08-28T10:00:00Z",
    "fecha_recibido": "2025-08-30T12:00:00Z",
    "nombre": "Hemocultivos",
    "resultado": "Negativo",
    "created_at": "2025-08-28T10:00:00Z"
  },
  {
    "id": "cult_2",
    "pase_id": "pase_2",
    "fecha_solicitud": "2025-08-25T09:00:00Z",
    "fecha_recibido": "2025-08-27T11:00:00Z",
    "nombre": "Cultivo peritoneal",
    "resultado": "E. coli resistente",
    "created_at": "2025-08-25T09:00:00Z"
  }
]
```
