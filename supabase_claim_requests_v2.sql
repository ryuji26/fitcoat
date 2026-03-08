-- 1. claim_requests_v2 テーブルの作成 (手動認証フロー用)
CREATE TABLE public.claim_requests_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shop_name TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. セキュリティとパフォーマンスのためのインデックス作成
CREATE INDEX idx_claim_requests_v2_status ON public.claim_requests_v2(status);

-- 3. Row Level Security (RLS) の設定
ALTER TABLE public.claim_requests_v2 ENABLE ROW LEVEL SECURITY;

-- 誰でも(匿名ユーザーでも)申請データを作成（INSERT）できるようにするポリシー
CREATE POLICY "Allow anonymous users to insert claim requests v2" 
ON public.claim_requests_v2
FOR INSERT 
WITH CHECK (true);

-- （備考）SELECT, UPDATE, DELETEはデフォルトで拒否されているため、
-- 管理画面（Supabaseダッシュボード）からのみ閲覧・管理が可能です。
