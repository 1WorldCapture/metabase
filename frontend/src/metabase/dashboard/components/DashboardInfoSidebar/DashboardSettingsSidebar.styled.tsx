import { css } from "@emotion/react";
import styled from "@emotion/styled";

import EditableText from "metabase/core/components/EditableText";
import { breakpointMaxSmall } from "metabase/styled-components/theme";

import { SIDEBAR_WIDTH } from "../Sidebar";

export const DashboardInfoSidebarRoot = styled.aside`
  width: ${SIDEBAR_WIDTH}px;
  min-width: ${SIDEBAR_WIDTH}px;
  background: var(--mb-color-bg-white);
  border-left: 1px solid var(--mb-color-border);
  align-self: stretch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  ${breakpointMaxSmall} {
    position: absolute;
    right: 0;
    z-index: 2;
    height: auto;
    border-bottom: 1px solid var(--mb-color-border);
  }
`;

export const HistoryHeader = styled.h3`
  margin-bottom: 1rem;
`;

export const DescriptionHeader = styled.h3`
  margin-bottom: 0.5rem;
`;

export const EditableDescription = styled(EditableText)<{ hasError?: boolean }>`
  ${props =>
    props.hasError &&
    css`
      border-color: var(--mb-color-error);

      &:hover {
        border-color: var(--mb-color-error);
      }
    `}
`;
