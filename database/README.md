# Database Design and Setup

This folder contains the improved database design for the UTI Medical Management System, based on the requirements in `docs/Pase.pdf`.

## Files

- `er_diagram.md` - Entity-Relationship diagram in Mermaid format
- `mock_data.md` - Comprehensive mock data for all tables in JSON format
- `supabase_setup.md` - Complete Supabase setup scripts including table creation, RLS policies, indexes, and triggers

## Key Improvements Made

### Schema Enhancements

- **Added proper relationships**: Fixed the incorrect `pase_id` in Paciente table; now Pase has `paciente_id` and `medico_id`
- **New tables**: Added `camas` (beds) table for better bed management
- **Renamed tables**: `User` → `medicos` for clarity
- **Added audit fields**: `created_at`, `updated_at`, `fecha_modificacion`
- **Status fields**: `activo` for users and patients, `ocupada` for beds

### Security

- Row Level Security (RLS) policies for all tables
- Role-based access control
- Encryption considerations for sensitive data

### Performance

- Proper indexes on foreign keys and common query fields
- Triggers for automatic timestamp updates

## Table Structure

1. **roles** - Medical roles (Médico Jefe, Residente, Enfermero)
2. **medicos** - Medical staff with role assignments
3. **camas** - Hospital beds with occupancy status
4. **pacientes** - Patients with bed assignments and admission details
5. **pases** - Daily medical reports with full clinical information
6. **cultivos** - Laboratory culture results

## Relationships

- Roles → Médicos (1:many)
- Camas → Pacientes (1:many)
- Médicos → Pases (1:many, creator)
- Pacientes → Pases (1:many)
- Pacientes → Cultivos (1:many)

## Next Steps

1. Execute the SQL scripts in `supabase_setup.md` in your Supabase project
2. Insert the mock data from `mock_data.md` for testing
3. Update your application types and API calls to match the new schema
4. Implement authentication and authorization based on the RLS policies
