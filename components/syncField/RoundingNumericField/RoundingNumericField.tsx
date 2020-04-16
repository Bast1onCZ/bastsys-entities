import React, {forwardRef, memo, useEffect} from 'react'
import useSolidValue from '@bast1oncz/state/useSolidValue'
import RoundingNumericBareField from '@bast1oncz/components/components/form/RoundingNumericField'
import useNumberField from '../../../hooks/entityField/useNumberField'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import {RoundingNumericFieldProps} from '@bast1oncz/components/components/form/RoundingNumericField/types'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'

export interface RoundingNumericSyncFieldProps extends Omit<RoundingNumericFieldProps, 'value' | 'onChange'>, SyncFieldDefinition {
    hidden?: boolean
}

const RoundingNumericField = forwardRef<SyncFieldReference, RoundingNumericSyncFieldProps>((props, ref) => {
    const {changeTempValue, confirmChange, isDirty, isSyncing, tempValue, value, disabled} = useNumberField(props, ref)

    const shownValue = (isDirty ? tempValue : value) as number

    const solidTempValue = useSolidValue(tempValue, 1000)
    useEffect(() => {
        if (solidTempValue !== undefined && value !== solidTempValue) {
            confirmChange()
        }
    }, [value, solidTempValue])

    return props.hidden
        ? null
        : (
            <RoundingNumericBareField
                value={shownValue}
                onChange={changeTempValue}
                disabled={isSyncing || props.disabled || disabled}
                min={props.min}
                max={props.max}
                rounding={props.rounding}
                step={props.step}

                variant={props.variant}
                inputClassName={props.inputClassName}
                buttonVariant={props.buttonVariant}
                buttonClassName={props.buttonClassName}
            />
        )
})

export default memo(RoundingNumericField)
