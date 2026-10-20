import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  Content,
  Grid,
  Row,
  Column,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  InlineNotification,
  Stack,
  Theme,
  RadioButtonGroup,
  RadioButton,
  Link,
  Modal
} from '@carbon/react';
import { 
  ShoppingCart, ChartBar, Box, UserMultiple, UserAvatar, 
  Switcher as SwitcherIcon, Notification, ColorPalette, Translate,
  Store, Calculator, Tag, Star, Wifi, WifiOff, Receipt, DataBase, CloudUpload, Locked, Settings as SettingsIcon, Barcode, Search,
  Information, Carbon
} from '@carbon/icons-react';
import { useCashier } from '../../modules/auth/context/CashierContext';
import { useHardware } from '../../infrastructure/hardware/HardwareContext';
import CarbonNotificationCenter from '../../modules/notifications/components/CarbonNotificationCenter';
import SpotlightSearch from './SpotlightSearch';
import ConnectivitySyncStatus from '../../components/ConnectivitySyncStatus';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeCashier, logout } = useCashier();
  const { isScannerConnected } = useHardware();

  const [isSwitcherExpanded, setIsSwitcherExpanded] = useState(false);
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('white');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K or Ctrl+K for Spotlight search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(true);
        return;
      }

      // Ignore key events from input or textarea elements to avoid disrupting normal typing
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Check for Alt + Shift + Key combinations
      if (e.altKey && e.shiftKey) {
        switch (e.code) {
          case 'KeyP':
            e.preventDefault();
            navigate('/pos');
            break;
          case 'KeyD':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case 'KeyR':
            e.preventDefault();
            navigate('/products');
            break;
          case 'KeyC':
            e.preventDefault();
            navigate('/customers');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Theme theme={currentTheme as any}>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header aria-label={t('app_title')}>
            <SkipToContent />
            <HeaderMenuButton
              aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
              isCollapsible
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="#" prefix="IBM" onClick={(e) => { e.preventDefault(); navigate('/pos'); }}>
              Carbon POS
            </HeaderName>
            
            <HeaderGlobalBar>
              <ConnectivitySyncStatus />
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', borderInlineStart: '1px solid var(--cds-border-subtle)', color: isScannerConnected ? 'var(--cds-support-success)' : 'var(--cds-text-helper)' }}>
                <Barcode size={20} style={{ marginInlineEnd: '0.5rem' }} />
                <span className="label-01">{isScannerConnected ? 'Scanner Connected' : 'Scanner Disconnected'}</span>
              </div>
              <HeaderGlobalAction
                aria-label="Spotlight Search (Cmd+K)"
                tooltipAlignment="end"
                onClick={() => setIsSpotlightOpen(true)}
              >
                <Search size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label={i18n.language === 'ar' ? 'Reflect to LTR (English)' : 'Reflect to RTL (Arabic)'}
                tooltipAlignment="end"
                onClick={toggleLanguage}
              >
                <Translate size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Theme Settings"
                tooltipAlignment="end"
                isActive={isThemeExpanded}
                onClick={() => {
                  setIsThemeExpanded(!isThemeExpanded);
                  setIsNotificationsExpanded(false);
                  setIsSwitcherExpanded(false);
                }}
              >
                <ColorPalette size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Notifications"
                tooltipAlignment="end"
                isActive={isNotificationsExpanded}
                onClick={() => {
                  setIsNotificationsExpanded(!isNotificationsExpanded);
                  setIsSwitcherExpanded(false);
                  setIsThemeExpanded(false);
                }}
              >
                <Notification size={20} />
              </HeaderGlobalAction>
              
              {activeCashier && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', borderInlineStart: '1px solid var(--cds-border-subtle)', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: activeCashier.avatarColor || 'var(--cds-interactive-01, #0f62fe)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      userSelect: 'none'
                    }}
                    title={`${activeCashier.name} (${activeCashier.role})`}
                  >
                    {activeCashier.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="body-01" style={{ fontWeight: 600 }}>
                    {activeCashier.name}
                  </span>
                  <HeaderGlobalAction 
                    aria-label="Lock Terminal" 
                    tooltipAlignment="end"
                    onClick={logout}
                  >
                    <Locked size={20} />
                  </HeaderGlobalAction>
                </div>
              )}

              <HeaderGlobalAction
                aria-label="System Information & About"
                tooltipAlignment="end"
                isActive={isAboutOpen}
                onClick={() => setIsAboutOpen(true)}
              >
                <Information size={20} />
              </HeaderGlobalAction>

              <HeaderGlobalAction
                aria-label="App Switcher"
                tooltipAlignment="end"
                isActive={isSwitcherExpanded}
                onClick={() => {
                  setIsSwitcherExpanded(!isSwitcherExpanded);
                  setIsNotificationsExpanded(false);
                  setIsThemeExpanded(false);
                }}
              >
                <SwitcherIcon size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
            
            <HeaderPanel expanded={isThemeExpanded} aria-label="Theme Settings Panel">
              <div style={{ padding: '1.5rem' }}>
                <h4 className="heading-03" style={{ marginBottom: '1rem' }}>Theme Settings</h4>
                <p className="body-01" style={{ marginBottom: '2rem', color: 'var(--cds-text-secondary)' }}>
                  Select a Carbon theme to preview its appearance across the POS system.
                </p>
                <RadioButtonGroup
                  legendText="Available Themes"
                  name="theme-selection"
                  defaultSelected={currentTheme}
                  onChange={(val) => setCurrentTheme(val as string)}
                  orientation="vertical"
                >
                  <RadioButton labelText="White" value="white" id="theme-white" />
                  <RadioButton labelText="Gray 10" value="g10" id="theme-g10" />
                  <RadioButton labelText="Gray 90 (Dark)" value="g90" id="theme-g90" />
                  <RadioButton labelText="Gray 100 (Dark)" value="g100" id="theme-g100" />
                </RadioButtonGroup>
              </div>
            </HeaderPanel>

            <HeaderPanel expanded={isNotificationsExpanded} aria-label="Notifications Panel">
              <div style={{ width: '380px', maxWidth: '100vw', padding: '1rem' }}>
                <CarbonNotificationCenter compact />
              </div>
            </HeaderPanel>

            <HeaderPanel expanded={isSwitcherExpanded} aria-label="App Switcher Panel">
              <Switcher aria-label="App Switcher">
                <SwitcherItem aria-label="POS" onClick={() => { setIsSwitcherExpanded(false); navigate('/pos'); }}>
                  Retail POS
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="IBM Products Patterns" onClick={() => { setIsSwitcherExpanded(false); navigate('/ibm-products'); }}>
                  IBM Products Patterns
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="Layout Reflection" onClick={() => { setIsSwitcherExpanded(false); navigate('/reflection'); }}>
                  UI Shell Layout Reflection
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="Carbon Patterns" onClick={() => { setIsSwitcherExpanded(false); navigate('/patterns'); }}>
                  Carbon Core Patterns Lab
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="Storybook Catalog" onClick={() => { setIsSwitcherExpanded(false); navigate('/storybook'); }}>
                  Carbon React Storybook Catalog
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="Products" onClick={() => { setIsSwitcherExpanded(false); navigate('/products'); }}>
                  Products Catalog
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="CRM" onClick={() => { setIsSwitcherExpanded(false); navigate('/crm'); }}>
                  Momken CRM
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="Accounting" onClick={() => { setIsSwitcherExpanded(false); navigate('/accounting'); }}>
                  Fiscal Accounting
                </SwitcherItem>
                <SwitcherDivider />
                <SwitcherItem aria-label="Ecosystem" onClick={() => { setIsSwitcherExpanded(false); navigate('/dashboard'); }}>
                  Ecosystem Overview
                </SwitcherItem>
              </Switcher>
            </HeaderPanel>
          </Header>

          <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isRail>
            <SideNavItems>
              <SideNavLink
                renderIcon={ShoppingCart}
                isActive={location.pathname === '/pos' || location.pathname === '/'}
                onClick={() => navigate('/pos')}
                large
              >
                Point of Sale
              </SideNavLink>

              <SideNavLink
                renderIcon={Carbon}
                isActive={location.pathname === '/reflection' || location.pathname === '/layout' || location.pathname === '/layout-reflection'}
                onClick={() => navigate('/reflection')}
                large
              >
                Layout Reflection
              </SideNavLink>
              
              {/* POS & Operations */}
              <SideNavMenu renderIcon={ShoppingCart} title="Operations" defaultExpanded>
                <SideNavMenuItem 
                  isActive={location.pathname === '/pos' || location.pathname === '/'} 
                  onClick={() => navigate('/pos')}
                >
                  {t('pos')} <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.6 }}>(Alt+Shift+P)</span>
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/crm'} 
                  onClick={() => navigate('/crm')}
                >
                  {t('crm')} <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.6 }}>(Alt+Shift+C)</span>
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/kds'} 
                  onClick={() => navigate('/kds')}
                >
                  Kitchen Display (KDS)
                </SideNavMenuItem>
              </SideNavMenu>

              {/* Inventory & Fulfillment */}
              <SideNavMenu renderIcon={Box} title="Inventory & Commerce">
                <SideNavMenuItem 
                  isActive={location.pathname === '/products'} 
                  onClick={() => navigate('/products')}
                >
                  {t('products')}
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/inventory'} 
                  onClick={() => navigate('/inventory')}
                >
                  {t('inventory')}
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/rfid'} 
                  onClick={() => navigate('/rfid')}
                >
                  {t('rfid')}
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/ecommerce'} 
                  onClick={() => navigate('/ecommerce')}
                >
                  {t('ecommerce')}
                </SideNavMenuItem>
              </SideNavMenu>

              {/* Marketing */}
              <SideNavMenu renderIcon={Tag} title="Marketing">
                <SideNavMenuItem 
                  isActive={location.pathname === '/promotions'} 
                  onClick={() => navigate('/promotions')}
                >
                  {t('promotions')}
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/loyalty'} 
                  onClick={() => navigate('/loyalty')}
                >
                  {t('loyalty')}
                </SideNavMenuItem>
              </SideNavMenu>

              {/* Enterprise */}
              <SideNavMenu renderIcon={Store} title="Enterprise">
                <SideNavMenuItem 
                  isActive={location.pathname === '/dashboard'} 
                  onClick={() => navigate('/dashboard')}
                >
                  Platform Ecosystem <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.6 }}>(Alt+Shift+D)</span>
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/multi-store'} 
                  onClick={() => navigate('/multi-store')}
                >
                  {t('multi_store')}
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/accounting'} 
                  onClick={() => navigate('/accounting')}
                >
                  {t('accounting')}
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/settings'} 
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </SideNavMenuItem>
              </SideNavMenu>

              {/* Design System & Patterns */}
              <SideNavMenu renderIcon={Carbon} title="Design System" defaultExpanded>
                <SideNavMenuItem 
                  isActive={location.pathname === '/ibm-products' || location.pathname === '/ibm-patterns'} 
                  onClick={() => navigate('/ibm-products')}
                >
                  IBM Products Patterns
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/reflection' || location.pathname === '/layout' || location.pathname === '/layout-reflection'} 
                  onClick={() => navigate('/reflection')}
                >
                  Layout Reflection
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/patterns'} 
                  onClick={() => navigate('/patterns')}
                >
                  Core Patterns Lab
                </SideNavMenuItem>
                <SideNavMenuItem 
                  isActive={location.pathname === '/storybook' || location.pathname === '/components'} 
                  onClick={() => navigate('/storybook')}
                >
                  Storybook Catalog
                </SideNavMenuItem>
              </SideNavMenu>

            </SideNavItems>
          </SideNav>

          <Content id="main-content" style={{ minHeight: 'calc(100vh - 3rem)', height: 'calc(100vh - 3rem)', backgroundColor: 'var(--cds-background)', padding: 0, overflow: 'hidden' }}>
            <Outlet />
          </Content>
          <SpotlightSearch isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />
          
          <Modal
            open={isAboutOpen}
            onRequestClose={() => setIsAboutOpen(false)}
            modalHeading="IBM Carbon Enterprise POS"
            modalLabel="System Information"
            passiveModal
          >
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <Store size={48} style={{ color: 'var(--cds-link-primary, #0f62fe)', flexShrink: 0 }} />
              <div>
                <h3 className="heading-03" style={{ marginBottom: '0.25rem' }}>IBM Carbon Enterprise POS</h3>
                <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
                  v2.6.4-LTS (Build 20260906)
                </p>
                <p className="body-01">
                  High-performance, offline-first Point of Sale and multi-store retail operating system built strictly on the Carbon Design System (<Link href="https://github.com/carbon-design-system/carbon" target="_blank">https://github.com/carbon-design-system/carbon</Link>).
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--cds-border-subtle)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Core System Architecture
              </div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', lineHeight: 1.6, margin: 0, color: 'var(--cds-text-secondary)' }}>
                <li>UI Foundation: <strong>@carbon/react (Carbon Design System)</strong></li>
                <li>Hardware Bridge: ESC/POS Network Spooler (Raw TCP 9100) + Web Serial Barcode API</li>
                <li>Compliance: ZATCA Phase 2 E-Invoice QR Generator & VAT Tax Accounting</li>
                <li>Persistence: Multi-Store Central Sync with Offline IndexedDB Cache</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--cds-border-subtle)', paddingTop: '1rem' }}>
              <Link href="https://github.com/carbon-design-system/carbon" target="_blank">
                Carbon Design System GitHub (https://github.com/carbon-design-system/carbon)
              </Link>
              <Link href="https://carbondesignsystem.com" target="_blank">
                Carbon Design System Documentation
              </Link>
              <Link href="https://preview.carbondesignsystem.com/building-blocks/core/patterns/overview" target="_blank">
                Carbon Core Patterns Overview
              </Link>
            </div>
          </Modal>
        </>
      )}
    />
    </Theme>
  );
}
