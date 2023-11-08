import { useMemo } from "react";
import { t } from "ttag";
import * as Yup from "yup";

import Button from "metabase/core/components/Button";
import FormFooter from "metabase/core/components/FormFooter";
import {
  Form,
  FormErrorMessage,
  FormProvider,
  FormTextInput,
  FormSubmitButton,
} from "metabase/forms";
import FormTextArea from "metabase/core/components/FormTextArea";

import * as Errors from "metabase/lib/errors";

import type { CreateQueryActionParams } from "metabase/entities/actions";

import FormModelPicker from "metabase/models/containers/FormModelPicker";

const ACTION_SCHEMA = Yup.object({
  name: Yup.string()
    .required(Errors.required)
    .max(100, Errors.maxLength)
    .default(""),
  description: Yup.string().nullable().max(255, Errors.maxLength).default(null),
  model_id: Yup.number().required(Errors.required),
});

export type FormValues = Pick<
  CreateQueryActionParams,
  "name" | "description" | "model_id"
>;

interface OwnProps {
  initialValues?: Partial<FormValues>;
  onCreate: (values: FormValues) => void;
  onCancel?: () => void;
}

type CreateActionFormProps = OwnProps;

function CreateActionForm({
  initialValues: initialValuesProp,
  onCreate,
  onCancel,
}: CreateActionFormProps) {
  const initialValues = useMemo(
    () => ({
      ...ACTION_SCHEMA.getDefault(),
      ...initialValuesProp,
    }),
    [initialValuesProp],
  );

  return (
    <FormProvider
      initialValues={initialValues as FormValues}
      validationSchema={ACTION_SCHEMA}
      onSubmit={onCreate}
    >
      {({ isValid }) => (
        <Form disabled={!isValid} data-testid="create-action-form">
          <FormTextInput
            name="name"
            title={t`Name`}
            placeholder={t`My new fantastic action`}
            autoFocus
          />
          <FormTextArea
            name="description"
            title={t`Description`}
            placeholder={t`It's optional but oh, so helpful`}
            nullable
          />
          <FormModelPicker name="model_id" title={t`Model it's saved in`} />
          <FormFooter>
            <FormErrorMessage inline />
            {!!onCancel && (
              <Button type="button" onClick={onCancel}>{t`Cancel`}</Button>
            )}
            <FormSubmitButton
              label={t`Create`}
              variant="filled"
              disabled={!isValid}
            />
          </FormFooter>
        </Form>
      )}
    </FormProvider>
  );
}

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default CreateActionForm;
