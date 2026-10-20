## General Principles
- **No Tailwind CSS**: DO NOT USE Tailwind CSS for this project. The user has explicitly forbidden the use of Tailwind CSS. Do not import it, do not use its utility classes, and do not configure it.
- **Styling Method**: This project strictly uses IBM Carbon Design System (@carbon/react, @carbon/styles) and its layout components (`Grid`, `Row`, `Column`, `Stack`) alongside standard inline styles or SCSS where required. Leverage Carbon tokens for spacing, typography, and colors.
- **Carbon UI Shell Header**: Enforced rules around using `HeaderContainer` for state management and linking the domain home in the `HeaderName`.
- **Carbon UI Shell Left Panel**: Added structural outlines for side navigation menus (`SideNav`, `SideNavLink`, `SideNavMenu`) and established best practices for persistence states and dynamic active routing.
- **Carbon UI Shell Right Panel**: Established guidelines for slide-out overlay patterns for global utilities (like the App Switcher) and required accessibility focus management within `<HeaderPanel>`.

# AI Skill: Carbon UI Shell Header

**Description:** Standard operating procedures for implementing the base **UI Shell Header** component using the Carbon Design System in React. This focuses on the structural component itself, which serves as the foundation for the Global Header pattern.

## 1. Pattern Overview

The UI Shell Header is the topmost horizontal region of the application. It establishes the context of the product and serves as the primary container for top-level navigation and system utilities.

### Component Anatomy

* **HeaderContainer:** A state manager wrapper that handles the expansion states of side panels and menus.
* **Header:** The main HTML `<header>` element.
* **SkipToContent:** Accessibility link to bypass navigation.

## 2. React Implementation Standard

```jsx
import React from 'react';
import {
  HeaderContainer,
  Header,
  SkipToContent,
  HeaderName,
} from '@carbon/react';

export const UIShellHeader = () => (
  <HeaderContainer
    render={() => (
      <Header aria-label="IBM Platform Name">
        <SkipToContent />
        <HeaderName href="#" prefix="IBM">
          Product Name
        </HeaderName>
        {/* Navigation and Global Actions go here */}
      </Header>
    )}
  />
);
```

## 3. Required Best Practices

1. **State Management:** Always use `HeaderContainer` unless you are explicitly managing the UI shell state (like side panel toggles) via your own global state management (e.g., Redux, Zustand).
2. **Domain Home:** The `HeaderName` must always link the user to the domain's home page, never to an external site or new tab.

---

# AI Skill: Carbon UI Shell Left Panel

**Description:** Standard operating procedures for implementing the **UI Shell Left Panel** (Side Navigation) using the Carbon Design System in React.

## 1. Pattern Overview

The Left Panel provides local navigation to help users move between different areas of a specific product or workflow. It is vertically stacked and can support multiple levels of hierarchy (sub-menus) without overlaying main page content.

### Component Anatomy

* **SideNav:** The main `<nav>` container for the left panel.
* **SideNavItems:** The wrapper for the list of navigation links.
* **SideNavLink:** A single, direct navigation link.
* **SideNavMenu / SideNavMenuItem:** A dropdown menu and its nested links.

## 2. React Implementation Standard

```jsx
import React from 'react';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from '@carbon/react';
import { Fade, Document } from '@carbon/icons-react';

export const UILeftPanel = ({ isSideNavExpanded }) => (
  <SideNav
    aria-label="Side navigation"
    expanded={isSideNavExpanded}
    isPersistent={false} // Set to true if the panel should push content rather than overlay
  >
    <SideNavItems>
      <SideNavLink renderIcon={Fade} href="#">
        Overview
      </SideNavLink>
      <SideNavMenu renderIcon={Document} title="Reports">
        <SideNavMenuItem href="#">Daily Traffic</SideNavMenuItem>
        <SideNavMenuItem href="#">Revenue</SideNavMenuItem>
      </SideNavMenu>
    </SideNavItems>
  </SideNav>
);
```

## 3. Required Best Practices

1. **Unbound Content:** Never place unbound content (content with no upper limit, like user-generated lists) in the side navigation. Use drill-down patterns or main page content for these instead.
2. **Persistence State:** The `expanded` prop must be tied to the state provided by the `HeaderContainer` (or your app's global state) via the Hamburger menu button in the header.
3. **Active States:** Ensure the `isActive` prop is dynamically set to `true` based on the user's current route to provide a visual "sense of place".

---

# AI Skill: Carbon UI Shell Right Panel

**Description:** Standard operating procedures for implementing the **UI Shell Right Panel** using the Carbon Design System in React.

## 1. Pattern Overview

The Right Panel is used as an overlay for system-level utilities, most commonly the **App Switcher** or **Notifications**. It keeps users in their current context while allowing them to interact with global system features.

### Component Anatomy

* **HeaderPanel:** The container that slides out from the right side of the screen.
* **Switcher / SwitcherItem:** Specialized components used specifically within the HeaderPanel for navigating between different products or systems.

## 2. React Implementation Standard

```jsx
import React, { useState } from 'react';
import {
  Header,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
} from '@carbon/react';
import { Fade } from '@carbon/icons-react';

export const UIRightPanel = () => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  return (
    <Header aria-label="IBM Platform Name">
      {/* ... other header elements ... */}
      
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="App Switcher"
          tooltipAlignment="end"
          isActive={isPanelExpanded}
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
        >
          <Fade size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>

      <HeaderPanel expanded={isPanelExpanded} aria-label="App Switcher Panel">
        <Switcher aria-label="App Switcher">
          <SwitcherItem aria-label="Product 1" href="#">
            Product 1
          </SwitcherItem>
          <SwitcherDivider />
          <SwitcherItem aria-label="Product 2" href="#">
            Product 2
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </Header>
  );
};
```

## 3. Required Best Practices

1. **Toggling:** The Right Panel's expansion state must be strictly controlled by a corresponding `<HeaderGlobalAction>` utility icon in the global header.
2. **Accessibility Focus:** When the panel opens, ensure focus is appropriately managed so screen readers enter the panel's context.
3. **Scope limitation:** The right panel should strictly contain global, system-level tasks or navigation. It should *not* be used for complex product-level forms or deep local settings.
