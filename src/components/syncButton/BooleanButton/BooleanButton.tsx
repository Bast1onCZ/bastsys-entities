import {SmartButtonProps} from '@bast1oncz/components/dist/components/SmartButton/types'
import React, {memo} from 'react'
import {FieldReference} from '../../../logic/fieldReferences'
import SmartButton from '@bast1oncz/components/dist/components/SmartButton'
import useBooleanButton from '../../../hooks/entityIndicator/useBooleanIndicator'

export type SyncPacketProps<T> = Omit<SmartButtonProps, 'onClick'> & {
    updateKey: FieldReference
    onCompleted?: (prevEntity: T, newEntity: T) => void
}

function BooleanButton<T>(props: SyncPacketProps<T>) {
    const {
        updateKey, onCompleted,
        disabled: disabledProp, loading: loadingProp, children,
        ...restProps
    } = props

    const {disabled, isSyncing, confirm} = useBooleanButton(props)

    return (
        <SmartButton
            {...restProps}
            disabled={disabled || disabledProp}
            loading={isSyncing || loadingProp}
            onClick={confirm}
        >
            {children}
        </SmartButton>
    )
}

export default memo(BooleanButton)
