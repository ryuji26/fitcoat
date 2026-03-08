-- 1. claim_requests_v3 テーブルの作成 (申請種別を追加)
CREATE TABLE public.claim_requests_v3 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    claim_type TEXT NOT NULL DEFAULT 'claim', -- 'claim' (権限申請) または 'remove' (掲載取り下げ)
    shop_name TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. セキュリティとパフォーマンスのためのインデックス作成
CREATE INDEX idx_claim_requests_v3_status ON public.claim_requests_v3(status);
CREATE INDEX idx_claim_requests_v3_type ON public.claim_requests_v3(claim_type);

-- 3. Row Level Security (RLS) の設定
ALTER TABLE public.claim_requests_v3 ENABLE ROW LEVEL SECURITY;

-- 誰でも(匿名ユーザーでも)申請データを作成（INSERT）できるようにするポリシー
CREATE POLICY "Allow anonymous users to insert claim requests v3" 
ON public.claim_requests_v3
FOR INSERT 
WITH CHECK (true);

-- （備考）SELECT, UPDATE, DELETEはデフォルトで拒否されているため、
-- 管理画面（SupabaseダッシュボードやService Role）からのみ閲覧・管理が可能です。
