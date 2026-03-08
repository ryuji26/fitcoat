'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export default function ReCaptchaProvider({ children }: { children: React.ReactNode }) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!siteKey) {
        // キーが設定されていない場合は reCAPTCHA なしでレンダリング
        return <>{children}</>
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey}
            language="ja"
        >
            {children}
        </GoogleReCaptchaProvider>
    )
}
