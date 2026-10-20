# Carbon Design System: Developer Guidelines

## General Principles
- **No Tailwind CSS**: DO NOT USE Tailwind CSS for this project. The user has explicitly forbidden the use of Tailwind CSS. Do not import it, do not use its utility classes, and do not configure it.
- **Styling Method**: This project strictly uses IBM Carbon Design System (@carbon/react, @carbon/styles) and its layout components (`Grid`, `Row`, `Column`, `Stack`) alongside standard inline styles or SCSS where required. Leverage Carbon tokens for spacing, typography, and colors.

## UI Shell & Navigation Coordination
- Construct the main layout using `<HeaderContainer>`.
- The `expanded` state of the `<SideNav>` MUST be controlled by the `render` prop arguments (`isSideNavExpanded`, `onClickSideNavExpand`) provided by `<HeaderContainer>`.
- Use Carbon `<Grid>`, `<Row>`, and `<Column>` inside `<Content>` to structure the page layout.
