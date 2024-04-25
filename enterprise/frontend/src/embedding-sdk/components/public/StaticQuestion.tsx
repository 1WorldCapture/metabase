import cx from "classnames";
import { useEffect, useState } from "react";

import { withPublicComponentWrapper } from "embedding-sdk/components/private/PublicComponentWrapper";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import CS from "metabase/css/core/index.css";
import { useSelector } from "metabase/lib/redux";
import {
  onCloseChartType,
  onOpenChartSettings,
  setUIControls,
} from "metabase/query_builder/actions";
import QueryVisualization from "metabase/query_builder/components/QueryVisualization";
import ChartTypeSidebar from "metabase/query_builder/components/view/sidebars/ChartTypeSidebar";
import { getMetadata } from "metabase/selectors/metadata";
import { CardApi } from "metabase/services";
import { Box, Group } from "metabase/ui";
import { PublicMode } from "metabase/visualizations/click-actions/modes/PublicMode";
import Question from "metabase-lib/v1/Question";
import type { Card, CardId, Dataset } from "metabase-types/api";

interface QueryVisualizationProps {
  questionId: CardId;
  showVisualizationSelector?: boolean;
}

type State = {
  loading: boolean;
  card: Card | null;
  cardError?: Card | string | null;
  result: Dataset | null;
  resultError?: Dataset | string | null;
};

const _StaticQuestion = ({
  questionId,
  showVisualizationSelector,
}: QueryVisualizationProps): JSX.Element | null => {
  const metadata = useSelector(getMetadata);

  const [{ loading, card, result, cardError, resultError }, setState] =
    useState<State>({
      loading: false,
      card: null,
      cardError: null,
      result: null,
      resultError: null,
    });

  const loadCardData = async ({ questionId }: { questionId: number }) => {
    setState(prevState => ({
      ...prevState,
      loading: true,
    }));

    Promise.all([
      CardApi.get({ cardId: questionId }),
      CardApi.query({
        cardId: questionId,
      }),
    ])
      .then(([card, result]) => {
        setState(prevState => ({
          ...prevState,
          card,
          result,
          loading: false,
          cardError: null,
          resultError: null,
        }));
      })
      .catch(([cardError, resultError]) => {
        setState(prevState => ({
          ...prevState,
          result: null,
          card: null,
          loading: false,
          cardError,
          resultError,
        }));
      });
  };

  useEffect(() => {
    loadCardData({ questionId });
  }, [questionId]);

  const changeVisualization = (newQuestion: Question) => {
    setState({
      card: newQuestion.card(),
      result: result,
      loading: false,
    });
  };

  const isLoading = loading || (!result && !resultError);

  return (
    <LoadingAndErrorWrapper
      className={cx(CS.flexFull, CS.fullWidth)}
      loading={isLoading}
      error={cardError || resultError}
      noWrapper
    >
      {() => {
        const question = new Question(card, metadata);
        const legacyQuery = question.legacyQuery({
          useStructuredQuery: true,
        });

        return (
          <Group h="100%" pos="relative" align="flex-start">
            {showVisualizationSelector && (
              <Box w="355px">
                <ChartTypeSidebar
                  question={question}
                  result={result}
                  onOpenChartSettings={onOpenChartSettings}
                  onCloseChartType={onCloseChartType}
                  query={legacyQuery}
                  setUIControls={setUIControls}
                  updateQuestion={changeVisualization}
                />
              </Box>
            )}
            <QueryVisualization
              className={cx(CS.flexFull, CS.fullWidth)}
              question={question}
              rawSeries={[{ card, data: result?.data }]}
              isRunning={isLoading}
              isObjectDetail={false}
              isResultDirty={false}
              isNativeEditorOpen={false}
              result={result}
              noHeader
              mode={PublicMode}
            />
          </Group>
        );
      }}
    </LoadingAndErrorWrapper>
  );
};

export const StaticQuestion = withPublicComponentWrapper(_StaticQuestion);