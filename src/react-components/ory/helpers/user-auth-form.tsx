import {
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client"
import { FilterNodesByGroups } from "@ory/integrations/ui"
import cn from "classnames"

import { formStyle } from "../../../theme"
import { CustomOnSubmit, CustomOnSubmitCallback } from "./common"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { SelfServiceFlow } from "./types"

export type UpdateBody =
  | UpdateLoginFlowBody
  | UpdateRegistrationFlowBody
  | UpdateRecoveryFlowBody
  | UpdateVerificationFlowBody
  | UpdateSettingsFlowBody

export type UserAuthFormAdditionalProps = {
  onSubmit?: CustomOnSubmitCallback<UpdateBody>
}

// SelfServiceFlowForm props
export interface UserAuthFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    UserAuthFormAdditionalProps {
  flow: SelfServiceFlow
  children: React.ReactNode
  formFilterOverride?: FilterNodesByGroups
  submitOnEnter?: boolean
  className?: string
}

export const UserAuthForm = ({
  flow,
  children,
  submitOnEnter,
  onSubmit,
  formFilterOverride,
  className,
  ...props
}: UserAuthFormProps): JSX.Element => (
  <form
    className={cn(className, formStyle)}
    action={flow.ui.action}
    method={flow.ui.method}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !submitOnEnter) {
        e.stopPropagation()
        e.preventDefault()
      }
    }}
    {...(onSubmit && {
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        CustomOnSubmit<UpdateBody>(event, onSubmit)
      },
    })}
    {...props}
  >
    <>
      {/*always add csrf token and other hidden fields to form*/}
      <FilterFlowNodes
        filter={
          formFilterOverride || {
            nodes: flow.ui.nodes,
            groups: "default", // we only want to map hidden default fields here
            attributes: "hidden",
          }
        }
        includeCSRF={true}
      />
      {children}
    </>
  </form>
)
