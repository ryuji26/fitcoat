-- 1. claim_requests_v3 テーブルにトークン管理用カラムと店舗紐付けカラムを追加
ALTER TABLE public.claim_requests_v3
ADD COLUMN IF NOT EXISTS token UUID UNIQUE,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE;

-- 2. admin等が見やすいように、shop_id が登録されている既存の不要な行を一掃しておくのも手です。（または手動で）
