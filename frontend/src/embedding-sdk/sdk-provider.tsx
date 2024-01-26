import type * as React from "react";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { ThemeProvider } from "metabase/ui/components/theme/ThemeProvider";
import { EmotionCacheProvider } from "metabase/styled-components/components/EmotionCacheProvider";
import { getStore } from "metabase/store";
import reducers from "metabase/reducers-main";
import registerVisualizations from "metabase/visualizations/register";

import { EmbeddingContext } from "./context";

export const MetabaseProvider = ({
  children,
  apiUrl,
  secretKey,
}: {
  children: React.ReactNode;
  apiUrl: string;
  secretKey: string;
}): JSX.Element => {
  const store = getStore(reducers);

  useEffect(() => {
    registerVisualizations();
  }, []);

  return (
    <EmbeddingContext.Provider
      value={{
        apiUrl,
        secretKey,
      }}
    >
      <Provider store={store}>
        <EmotionCacheProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </EmotionCacheProvider>
      </Provider>
    </EmbeddingContext.Provider>
  );
};
