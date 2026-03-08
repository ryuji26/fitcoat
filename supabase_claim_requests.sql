-- 1. claim_requests テーブルの作成
CREATE TABLE public.claim_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. セキュリティとパフォーマンスのためのインデックス作成
CREATE INDEX idx_claim_requests_shop_id ON public.claim_requests(shop_id);
CREATE INDEX idx_claim_requests_status ON public.claim_requests(status);

-- 3. Row Level Security (RLS) の設定
ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;

-- 誰でも(匿名ユーザーでも)申請データを作成（INSERT）できるようにするポリシー
CREATE POLICY "Allow anonymous users to insert claim requests" 
ON public.claim_requests
FOR INSERT 
WITH CHECK (true);

-- （備考）SELECT, UPDATE, DELETEはデフォルトで拒否されているため、
-- 管理画面（SupabaseダッシュボードやService Role）からのみ閲覧・管理が可能です。
