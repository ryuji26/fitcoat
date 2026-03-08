-- 住所検索用の「pg_trgm」拡張機能を有効化（Supabaseで必須）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- shopsテーブルに独立系ショップかどうかの判定フラグを追加
-- デフォルトで独立系(true)とし、インポート時にチェーン店をfalseにします
ALTER TABLE public.shops 
ADD COLUMN IF NOT EXISTS is_independent BOOLEAN NOT NULL DEFAULT true;

-- 検索パフォーマンス向上のためのインデックス
CREATE INDEX IF NOT EXISTS idx_shops_is_independent ON public.shops(is_independent);
-- 住所検索用のインデックス
CREATE INDEX IF NOT EXISTS idx_shops_address ON public.shops USING gin (address gin_trgm_ops);
