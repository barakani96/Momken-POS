import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Grid,
  Row,
  Column,
  Tile,
  Button,
  InlineNotification,
  Accordion,
  AccordionItem,
  CodeSnippet,
  Stack,
  Theme
} from '@carbon/react';
import {
  WarningFilled,
  Restart,
  Home,
  Copy,
  Checkmark,
  Information
} from '@carbon/icons-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isCopied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    isCopied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isCopied: false,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleHardReload = (): void => {
    window.location.reload();
  };

  private handleNavigateHome = (): void => {
    window.location.href = '/';
  };

  private handleCopyDiagnostic = (): void => {
    const diagnosticData = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorMessage: this.state.error?.message || 'Unknown Error',
      errorStack: this.state.error?.stack || '',
      componentStack: this.state.errorInfo?.componentStack || '',
    };

    navigator.clipboard.writeText(JSON.stringify(diagnosticData, null, 2))
      .then(() => {
        this.setState({ isCopied: true });
        setTimeout(() => this.setState({ isCopied: false }), 3000);
      })
      .catch((err) => {
        console.error('Failed to copy error report:', err);
      });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, isCopied } = this.state;

      return (
        <Theme theme="g100">
          <div
            id="error-boundary-container"
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              backgroundColor: 'var(--cds-background)',
              color: 'var(--cds-text-primary)'
            }}
          >
            <Grid style={{ maxWidth: '840px', width: '100%' }}>
              <Row>
                <Column lg={16} md={8} sm={4}>
                  <Tile
                    id="error-boundary-tile"
                    style={{
                      padding: '2rem',
                      borderInlineStart: '4px solid var(--cds-support-error)',
                      backgroundColor: 'var(--cds-layer-01)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <Stack gap={6}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(218, 30, 40, 0.15)',
                            color: 'var(--cds-support-error)',
                            flexShrink: 0
                          }}
                        >
                          <WarningFilled size={28} />
                        </div>
                        <div>
                          <h2 className="heading-04" style={{ margin: 0, color: 'var(--cds-text-primary)' }}>
                            Something went wrong in the application
                          </h2>
                          <p className="body-01" style={{ margin: '0.25rem 0 0 0', color: 'var(--cds-text-secondary)' }}>
                            A client-side rendering exception was intercepted gracefully. Your session data in IndexedDB remains safe.
                          </p>
                        </div>
                      </div>

                      <InlineNotification
                        id="error-notification"
                        kind="error"
                        lowContrast
                        title="Runtime Error Intercepted"
                        subtitle={error?.message || 'An unexpected exception occurred during component render.'}
                        hideCloseButton
                      />

                      <div
                        id="error-boundary-actions"
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px solid var(--cds-border-subtle)'
                        }}
                      >
                        <Button
                          id="btn-retry-render"
                          kind="primary"
                          renderIcon={Restart}
                          iconDescription="Try Again"
                          onClick={this.handleReset}
                        >
                          Try Again
                        </Button>
                        <Button
                          id="btn-reload-page"
                          kind="secondary"
                          renderIcon={Restart}
                          iconDescription="Reload Page"
                          onClick={this.handleHardReload}
                        >
                          Reload Page
                        </Button>
                        <Button
                          id="btn-go-home"
                          kind="tertiary"
                          renderIcon={Home}
                          iconDescription="Return to POS"
                          onClick={this.handleNavigateHome}
                        >
                          Return to POS
                        </Button>
                        <Button
                          id="btn-copy-diagnostic"
                          kind="ghost"
                          renderIcon={isCopied ? Checkmark : Copy}
                          iconDescription={isCopied ? 'Diagnostic Copied!' : 'Copy Error Details'}
                          onClick={this.handleCopyDiagnostic}
                        >
                          {isCopied ? 'Diagnostic Copied!' : 'Copy Error Details'}
                        </Button>
                      </div>

                      <Accordion>
                        <AccordionItem
                          title="Technical Diagnostics & Stack Trace"
                        >
                          <Stack gap={4}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                              <Information size={16} />
                              <span className="label-01">
                                Component Stack & Trace for Developers:
                              </span>
                            </div>

                            {error?.stack && (
                              <div>
                                <span className="label-01" style={{ display: 'block', marginBottom: '0.25rem' }}>Error Stack:</span>
                                <CodeSnippet type="multi" feedback="Copied to clipboard">
                                  {error.stack}
                                </CodeSnippet>
                              </div>
                            )}

                            {errorInfo?.componentStack && (
                              <div>
                                <span className="label-01" style={{ display: 'block', marginBottom: '0.25rem' }}>Component Hierarchy:</span>
                                <CodeSnippet type="multi" feedback="Copied to clipboard">
                                  {errorInfo.componentStack.trim()}
                                </CodeSnippet>
                              </div>
                            )}
                          </Stack>
                        </AccordionItem>
                      </Accordion>
                    </Stack>
                  </Tile>
                </Column>
              </Row>
            </Grid>
          </div>
        </Theme>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
