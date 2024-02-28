import type { Location } from "history";
import { PublicDashboard as InternalPublicDashboard } from "metabase/public/containers/PublicDashboard";
import type { Dashboard } from "metabase-types/api";
import type { SuperDuperEmbedOptions } from "metabase/public/components/EmbedFrame/types";

export const PublicDashboard = ({
  uuid,
  location = {
    pathname: "",
    search: "?created_at=&plan=&source=&trial_converted=",
    hash: "",
    action: "REPLACE",
    key: "",
    query: {
      created_at: "",
      plan: "",
      source: "",
      trial_converted: "",
    },
    state: null,
  },
  embedOptions = {
    bordered: true,
    titled: true,
    theme: "transparent",
    hide_parameters: false,
    hide_download_button: false,
  },
}: {
  uuid: Dashboard["public_uuid"];
  location?: Location;
  embedOptions: SuperDuperEmbedOptions;
}) => (
  <InternalPublicDashboard
    uuid={uuid}
    embedOptions={embedOptions}
    parameterSelection={{}}
    hasAbsolutePositioning={false}
  />
);
