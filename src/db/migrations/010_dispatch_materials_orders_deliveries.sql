-- Migration 010: Dispatch Model — Materials, Orders, and Deliveries
-- Supports the full material supply chain: recommend → order → deliver.

CREATE TABLE job_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  material_name VARCHAR(200) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit VARCHAR(20) DEFAULT 'each',
  estimated_cost_cents INTEGER,
  supplier_source VARCHAR(20) DEFAULT 'manual',
  supplier_product_id TEXT,
  status VARCHAR(20) DEFAULT 'recommended',
  wiseman_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_job_materials_job ON job_materials(job_id);
CREATE INDEX idx_job_materials_status ON job_materials(status);

CREATE TABLE material_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  supplier_api VARCHAR(20) NOT NULL,
  external_order_id TEXT,
  status VARCHAR(30) DEFAULT 'pending',
  total_cents INTEGER,
  items_count INTEGER,
  pickup_address TEXT,
  pickup_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_material_orders_job ON material_orders(job_id);

CREATE TABLE delivery_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_order_id UUID NOT NULL REFERENCES material_orders(id) ON DELETE CASCADE,
  uber_delivery_id TEXT,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'requested',
  eta_minutes INTEGER,
  actual_delivery_at TIMESTAMPTZ,
  cost_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_delivery_requests_order ON delivery_requests(material_order_id);
