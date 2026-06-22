import { ActionButton } from '@/components'
import React, { ComponentProps } from 'react'

const BetterAuthActionBtn = ({
    action,
    successMessage,
    ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
    action: () => Promise<{ error: null | { message?: string } }>
    successMessage?: string
}) => {
    const authAction = async () => {
        try {
            const res = await action();

            if(res.error) {
                return { error: true, message: res.error.message || "Action failed" }
            } else {
                return {error: false, message: successMessage}
            }
        } catch(error) {
            console.error(error)
            return {error: true, message: error instanceof Error ? error.message : "Something went wrong"}
        }

    }

  return (
    <ActionButton
        {...props}
        action={authAction}
    />
  )
}

export default BetterAuthActionBtn