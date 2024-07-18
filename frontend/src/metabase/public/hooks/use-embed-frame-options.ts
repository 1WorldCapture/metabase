import type { Location } from "history";

import type { DashboardUrlHashOptions } from "metabase/dashboard/types";
import { parseHashOptions } from "metabase/lib/browser";
import { isWithinIframe } from "metabase/lib/dom";
import { PLUGIN_RESOURCE_DOWNLOADS } from "metabase/plugins";

import { DEFAULT_EMBED_DISPLAY_PARAMS } from "../constants";

export const useEmbedFrameOptions = ({ location }: { location: Location }) => {
  const {
    background = true,
    bordered = isWithinIframe(),
    titled = DEFAULT_EMBED_DISPLAY_PARAMS.titled,
    theme = DEFAULT_EMBED_DISPLAY_PARAMS.theme,
    hide_parameters = DEFAULT_EMBED_DISPLAY_PARAMS.hideParameters,
    hide_download_button = null,
    downloads = DEFAULT_EMBED_DISPLAY_PARAMS.downloadsEnabled,
  } = parseHashOptions(location.hash) as DashboardUrlHashOptions;

  const downloadsEnabled = PLUGIN_RESOURCE_DOWNLOADS.areDownloadsEnabled({
    hide_download_button,
    downloads,
  });

  return {
    background,
    bordered,
    titled,
    theme,
    hide_parameters,
    hide_download_button,
    downloadsEnabled,
  };
};
