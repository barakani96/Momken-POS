import React, { useState } from 'react';
import {
  Form,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Link,
  InlineLoading,
  InlineNotification,
  Stack,
  Tile
} from '@carbon/react';
import { ArrowRight, Locked, UserAvatar, Launch } from '@carbon/icons-react';
import { mockCashiers, Cashier } from '../data/mockCashiers';

interface CarbonLoginFormProps {
  onLoginSuccess?: (cashier: Cashier) => void;
  title?: string;
  subtitle?: string;
  showFooterLinks?: boolean;
}

export default function CarbonLoginForm({
  onLoginSuccess,
  title = "Log in to Enterprise POS",
  subtitle = "Enter your registered corporate credentials or IBMid to continue.",
  showFooterLinks = true
}: CarbonLoginFormProps) {
  const [username, setUsername] = useState('admin@ibm.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameInvalid(false);
    setPasswordInvalid(false);
    setErrorMessage('');

    let hasError = false;
    if (!username.trim()) {
      setUsernameInvalid(true);
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordInvalid(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setStatus('loading');

    setTimeout(() => {
      // Find matching cashier or fallback to first cashier (Store Manager)
      const matched = mockCashiers.find(
        (c) =>
          c.name.toLowerCase().includes(username.toLowerCase().split('@')[0]) ||
          username.toLowerCase().includes('admin') ||
          c.role.toLowerCase().includes('manager')
      ) || mockCashiers[0];

      if (password === 'wrong') {
        setStatus('error');
        setErrorMessage('Invalid username or password. Please verify your credentials and try again.');
      } else {
        setStatus('success');
        if (onLoginSuccess) {
          onLoginSuccess(matched);
        }
      }
    }, 1200);
  };

  const handleSSOLogin = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      if (onLoginSuccess) {
        onLoginSuccess(mockCashiers[0]);
      }
    }, 1000);
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      <Tile style={{ padding: '2.5rem 2rem', border: '1px solid var(--cds-border-subtle, #e0e0e0)' }}>
        <Stack gap={6}>
          {/* Header & Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--cds-interactive, #0f62fe)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}
              >
                <Locked size={24} />
              </div>
              <span className="label-01" style={{ color: 'var(--cds-text-secondary, #6f6f6f)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                IBM Carbon Core Pattern
              </span>
            </div>
            <h1 className="heading-04" style={{ fontWeight: 600, color: 'var(--cds-text-primary, #161616)' }}>
              {title}
            </h1>
            <p className="body-01" style={{ color: 'var(--cds-text-secondary, #525252)', marginTop: '0.375rem', lineHeight: '1.4' }}>
              {subtitle}
            </p>
          </div>

          {/* Feedback Notification */}
          {status === 'error' && (
            <InlineNotification
              kind="error"
              title="Authentication error"
              subtitle={errorMessage}
              onClose={() => setStatus('idle')}
            />
          )}

          {/* Core Login Form */}
          <Form onSubmit={handleSubmit}>
            <Stack gap={5}>
              <TextInput
                id="login-username"
                labelText="Username or corporate email"
                placeholder="e.g. j.smith@ibm.com"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (usernameInvalid) setUsernameInvalid(false);
                }}
                invalid={usernameInvalid}
                invalidText="Username or email is required"
                size="lg"
              />

              <PasswordInput
                id="login-password"
                labelText="Password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordInvalid) setPasswordInvalid(false);
                }}
                invalid={passwordInvalid}
                invalidText="Password is required"
                size="lg"
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <Checkbox
                  id="login-remember-me"
                  labelText="Remember username"
                  checked={rememberMe}
                  onChange={(_, { checked }) => setRememberMe(checked)}
                />
                <Link href="#forgot-password" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your corporate email.'); }} style={{ fontSize: '0.875rem' }}>
                  Forgot password?
                </Link>
              </div>

              {status === 'loading' ? (
                <InlineLoading status="active" description="Authenticating enterprise credentials..." />
              ) : (
                <Button
                  type="submit"
                  kind="primary"
                  size="lg"
                  renderIcon={ArrowRight}
                  style={{ width: '100%', maxWidth: '100%', justifyContent: 'space-between', marginTop: '0.5rem' }}
                >
                  Log in
                </Button>
              )}
            </Stack>
          </Form>

          {/* Alternative Single Sign-On (SSO) Section */}
          <div style={{ borderTop: '1px solid var(--cds-border-subtle, #e0e0e0)', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
            <p className="label-01" style={{ color: 'var(--cds-text-secondary, #6f6f6f)', marginBottom: '0.75rem' }}>
              Alternative Login Methods
            </p>
            <Button
              kind="tertiary"
              size="md"
              renderIcon={UserAvatar}
              onClick={handleSSOLogin}
              style={{ width: '100%', maxWidth: '100%', justifyContent: 'flex-start' }}
            >
              Log in with IBMid / SAML SSO
            </Button>
          </div>

          {/* Footer Legal & Support Links */}
          {showFooterLinks && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', fontSize: '0.75rem', borderTop: '1px solid var(--cds-border-subtle, #e0e0e0)', paddingTop: '1rem' }}>
              <Link href="#" style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary, #6f6f6f)' }}>
                Privacy Policy
              </Link>
              <span style={{ color: 'var(--cds-border-subtle, #e0e0e0)' }}>|</span>
              <Link href="#" style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary, #6f6f6f)' }}>
                Terms of Use
              </Link>
              <span style={{ color: 'var(--cds-border-subtle, #e0e0e0)' }}>|</span>
              <Link href="#" style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary, #6f6f6f)' }}>
                Help & Support <Launch size={10} />
              </Link>
            </div>
          )}
        </Stack>
      </Tile>
    </div>
  );
}
