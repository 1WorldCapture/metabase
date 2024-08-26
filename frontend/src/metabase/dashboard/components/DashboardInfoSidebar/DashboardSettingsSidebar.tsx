import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { useMount } from "react-use";
import { c, t } from "ttag";

import ErrorBoundary from "metabase/ErrorBoundary";
import {
  Sidesheet,
  SidesheetSection,
} from "metabase/common/components/Sidesheet";
import { toggleAutoApplyFilters } from "metabase/dashboard/actions";
import { isDashboardCacheable } from "metabase/dashboard/utils";
import { useUniqueId } from "metabase/hooks/use-unique-id";
import { useDispatch } from "metabase/lib/redux";
import { PLUGIN_CACHING } from "metabase/plugins";
import { Button, Flex, Icon, Stack, Switch } from "metabase/ui";
import type { Dashboard } from "metabase-types/api";

interface DashboardSettingsSidebarProps {
  dashboard: Dashboard;
  onClose: () => void;
}

export function DashboardSettingsSidebar({
  dashboard,
  onClose,
}: DashboardSettingsSidebarProps) {
  const [page, setPage] = useState<"default" | "caching">("default");

  const [isOpen, setIsOpen] = useState(false);

  useMount(() => {
    // this component is not rendered until it is "open"
    // but we want to set isOpen after it mounts to get
    // pretty animations
    setIsOpen(true);
  });

  return (
    <div data-testid="sidebar-right">
      <ErrorBoundary>
        {page === "default" && (
          <Sidesheet
            isOpen={isOpen}
            title={t`Dashboard settings`}
            onClose={onClose}
          >
            <DashboardSidesheetBody dashboard={dashboard} setPage={setPage} />
          </Sidesheet>
        )}
        {page === "caching" && (
          <PLUGIN_CACHING.DashboardStrategySidebar
            dashboard={dashboard}
            setPage={setPage}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}

//  FIXME: This content goes in the SETTINGS sheet, not the info sheet
export type DashboardSidebarPageProps = {
  dashboard: Dashboard;
  setPage: Dispatch<SetStateAction<"default" | "caching">>;
};

const DashboardSidesheetBody = ({
  dashboard,
  setPage,
}: DashboardSidebarPageProps) => {
  const dispatch = useDispatch();

  const handleToggleAutoApplyFilters = useCallback(
    (isAutoApplyingFilters: boolean) => {
      dispatch(toggleAutoApplyFilters(isAutoApplyingFilters));
    },
    [dispatch],
  );

  const autoApplyFilterToggleId = useUniqueId();
  const canWrite = dashboard.can_write && !dashboard.archived;

  const isCacheable = isDashboardCacheable(dashboard);
  const showCaching = canWrite && PLUGIN_CACHING.isGranularCachingEnabled();

  // FIXME: Is this 'archived' check still needed? Presumably the dashboard cannot be viewed if it is archived
  if (dashboard.archived) {
    return null;
  }

  return (
    <>
      <SidesheetSection spacing="md" title={t`General`}>
        <Stack spacing="sm">
          <Switch
            disabled={!canWrite}
            label={t`Auto-apply filters`}
            size="sm"
            id={autoApplyFilterToggleId}
            checked={dashboard.auto_apply_filters}
            onChange={e => handleToggleAutoApplyFilters(e.target.checked)}
          />
          <Switch
            label={c("An action that can be done to a dashboard")
              .t`Set to full-width layout`}
            size="sm"
            checked={false} // FIXME: implement
            onChange={
              // FIXME: implement
              _e => null
            }
          />
        </Stack>
      </SidesheetSection>
      {showCaching && isCacheable && (
        <PLUGIN_CACHING.SidebarCacheSection
          model="dashboard"
          item={dashboard}
          setPage={setPage}
        />
      )}
      <SidesheetSection spacing="xs" title={t`Timezone`} pb="sm">
        <Button
          px={0}
          variant="subtle"
          w="100%"
          styles={{
            label: {
              width: "100%",
            },
          }}
        >
          <Flex justify="space-between" w="100%" align="center" gap="xs">
            {t`Instance default`}
            <Icon color="var(--mb-color-text-dark)" name="chevronright" />
          </Flex>
        </Button>
      </SidesheetSection>

      <SidesheetSection>
        <Switch
          label={t`Persist model data`}
          size="sm"
          // FIXME: implement
        />
      </SidesheetSection>
    </>
  );
};
