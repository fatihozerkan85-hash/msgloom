import type { FormEvent } from "react";

type LoginScreenProps = {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  configured: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const features = [
  {
    title: "PDF kalıp arşivi",
    description: "Yüzlerce giysi kalıbını tek merkezde saklayın.",
    icon: (
      <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 3h8l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path d="M15 3v4h4M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    title: "Akıllı kategorileme",
    description: "Dosya adından kategori ve etiket önerisi alın.",
    icon: (
      <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16M4 12h10M4 17h14" />
        <circle cx="18" cy="12" r="2" />
        <circle cx="20" cy="17" r="2" />
      </svg>
    ),
  },
  {
    title: "Mobil atölye erişimi",
    description: "Telefondan yükleyin, arayın ve önizleyin.",
    icon: (
      <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect height="16" rx="2" width="12" x="6" y="4" />
        <path d="M10 18h4" />
      </svg>
    ),
  },
];

export function LoginScreen({
  configured,
  email,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  password,
}: LoginScreenProps) {
  return (
    <div className="login-shell">
      <div className="login-brand-panel">
        <div className="login-brand-inner">
          <p className="login-eyebrow">Dikim Atölyesi · Dijital Arşiv</p>
          <h1 className="login-brand-title">Özlem Akyüz</h1>
          <p className="login-brand-subtitle">Kalıp Arşivi</p>
          <p className="login-brand-copy">
            Giysi kalıplarınızı düzenli, güvenli ve her an erişilebilir bir arşivde
            toplayın. Profesyonel atölye iş akışı için tasarlandı.
          </p>

          <ul className="login-feature-list">
            {features.map((feature) => (
              <li className="login-feature-item" key={feature.title}>
                <span className="login-feature-icon">{feature.icon}</span>
                <div>
                  <p className="login-feature-title">{feature.title}</p>
                  <p className="login-feature-desc">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="login-brand-footer">
          <span>msgloom.com.tr</span>
          <span className="login-brand-dot" />
          <span>Güvenli bulut arşiv</span>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-card">
          <div className="login-form-header">
            <p className="login-form-eyebrow">Hoş geldiniz</p>
            <h2 className="login-form-title">Atölye hesabınıza giriş yapın</h2>
            <p className="login-form-lead">
              Giriş yaptıktan sonra kalıp yükleyebilir, kategorilere ayırabilir ve arşivinizi
              yönetebilirsiniz.
            </p>
          </div>

          {!configured ? (
            <div className="login-alert login-alert-warning">
              Sistem yapılandırması tamamlanıyor. Lütfen kısa süre sonra tekrar deneyin.
            </div>
          ) : null}

          {error ? <div className="login-alert login-alert-error">{error}</div> : null}

          <form className="login-form" onSubmit={onSubmit}>
            <label className="login-field">
              <span>E-posta adresi</span>
              <input
                autoComplete="email"
                className="login-input"
                disabled={!configured || loading}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="ornek@atolye.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="login-field">
              <span>Şifre</span>
              <input
                autoComplete="current-password"
                className="login-input"
                disabled={!configured || loading}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </label>

            <button className="login-submit" disabled={!configured || loading} type="submit">
              {loading ? (
                <span className="login-submit-loading">
                  <span className="login-spinner" />
                  Giriş yapılıyor...
                </span>
              ) : (
                "Arşive Giriş Yap"
              )}
            </button>
          </form>

          <p className="login-form-note">
            Bu alan yalnızca yetkili atölye kullanıcıları içindir.
          </p>
        </div>
      </div>
    </div>
  );
}
