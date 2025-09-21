# Supabase Database Setup

## Table Creation Scripts

### 1. Roles Table
```sql
CREATE TABLE roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_rol VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read roles
CREATE POLICY "Allow authenticated users to read roles" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 2. Médicos Table
```sql
CREATE TABLE medicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rol_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL, -- Encrypted in production
  apellido TEXT NOT NULL, -- Encrypted in production
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE medicos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read medicos" ON medicos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow medicos to update their own data" ON medicos
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow admins to manage medicos" ON medicos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM medicos m
      JOIN roles r ON m.rol_id = r.id
      WHERE m.id = auth.uid() AND r.tipo_rol = 'Médico Jefe'
    )
  );
```

### 3. Camas Table
```sql
CREATE TABLE camas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero VARCHAR(10) UNIQUE NOT NULL,
  sala VARCHAR(50) DEFAULT 'UTI',
  ocupada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE camas ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read camas
CREATE POLICY "Allow authenticated users to read camas" ON camas
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow medicos to update camas
CREATE POLICY "Allow medicos to update camas" ON camas
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### 4. Pacientes Table
```sql
CREATE TABLE pacientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL, -- Encrypted in production
  apellido TEXT NOT NULL, -- Encrypted in production
  cama_id UUID REFERENCES camas(id) ON DELETE SET NULL,
  motivo_ingreso TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_alta TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read pacientes" ON pacientes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow medicos to manage pacientes" ON pacientes
  FOR ALL USING (auth.role() = 'authenticated');
```

### 5. Pases Table
```sql
CREATE TABLE pases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  medico_id UUID REFERENCES medicos(id) ON DELETE SET NULL,
  principal TEXT,
  antecedentes TEXT,
  gcs_rass VARCHAR(50),
  cultivos_id UUID REFERENCES cultivos(id) ON DELETE SET NULL,
  atb TEXT,
  vc_cook TEXT,
  actualmente TEXT,
  pendientes TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pases ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read pases" ON pases
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow medicos to manage pases" ON pases
  FOR ALL USING (auth.role() = 'authenticated');
```

### 6. Cultivos Table
```sql
CREATE TABLE cultivos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pase_id UUID REFERENCES pases(id) ON DELETE CASCADE,
  fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_recibido TIMESTAMP WITH TIME ZONE,
  nombre TEXT NOT NULL,
  resultado TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cultivos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read cultivos" ON cultivos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow medicos to manage cultivos" ON cultivos
  FOR ALL USING (auth.role() = 'authenticated');
```

## Indexes for Performance
```sql
-- Indexes for foreign keys
CREATE INDEX idx_medicos_rol_id ON medicos(rol_id);
CREATE INDEX idx_pacientes_cama_id ON pacientes(cama_id);
CREATE INDEX idx_pases_paciente_id ON pases(paciente_id);
CREATE INDEX idx_pases_medico_id ON pases(medico_id);
CREATE INDEX idx_pases_cultivos_id ON pases(cultivos_id);
CREATE INDEX idx_cultivos_pase_id ON cultivos(pase_id);

-- Indexes for common queries
CREATE INDEX idx_pacientes_activo ON pacientes(activo);
CREATE INDEX idx_pases_fecha_creacion ON pases(fecha_creacion);
CREATE INDEX idx_cultivos_fecha_solicitud ON cultivos(fecha_solicitud);
```

## Triggers for Updated At
```sql
-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_medicos_updated_at BEFORE UPDATE ON medicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON pacientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pases_fecha_modificacion BEFORE UPDATE ON pases FOR EACH ROW EXECUTE FUNCTION update_pases_fecha_modificacion();
```

## Insert Initial Data
```sql
-- Insert roles
INSERT INTO roles (tipo_rol) VALUES
('Médico Jefe'),
('Residente'),
('Enfermero');

-- Insert camas
INSERT INTO camas (numero, sala) VALUES
('101', 'UTI-1'),
('102', 'UTI-1'),
('103', 'UTI-1'),
('201', 'UTI-2'),
('202', 'UTI-2');