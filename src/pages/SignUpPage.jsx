import { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/features/userAuthSlice';
import AuthImagePattern from '../Components/AuthImagePattern';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function SignUpPage() {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSigningUp } = useSelector((store) => store.userAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error(t('signUpPage.errors.fullNameRequired'));
    if (!formData.email.trim()) return toast.error(t('signUpPage.errors.emailRequired'));
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error(t('signUpPage.errors.invalidEmailFormat'));
    if (!formData.password) return toast.error(t('signUpPage.errors.passwordRequired'));
    if (formData.password.length < 6)
      return toast.error(t('signUpPage.errors.passwordMinLength'));

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) dispatch(signupUser(formData));
  };
  console.clear()
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">{t('signUpPage.title')}</h1>
              <p className="text-base-content/60">{t('signUpPage.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('signUpPage.fullName')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder={t('signUpPage.placeholders.fullName')}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('signUpPage.email')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder={t('signUpPage.placeholders.email')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('signUpPage.password')}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input input-bordered w-full pl-10`}
                  placeholder={t('signUpPage.placeholders.password')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  {t('signUpPage.loading')}
                </>
              ) : (
                t('signUpPage.submit')
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              {t('signUpPage.haveAccount')}{' '}
              <Link to="/login" className="link link-primary">
                {t('signUpPage.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title={t('signUpPage.imagePatternTitle')}
        subtitle={t('signUpPage.imagePatternSubtitle')}
      />
    </div>
  );
}

export default SignUpPage;
