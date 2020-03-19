import React, {forwardRef, memo, useEffect} from 'react'
import useSolidValue from '@bast1oncz/state/dist/useSolidValue'
import RoundingNumericBareField from '@bast1oncz/components/dist/components/form/RoundingNumericField'
import {RoundingNumericSyncFieldProps} from './types'
import useNumberField from '../../../hooks/entityField/useNumberField'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'

const RoundingNumericField = forwardRef<SyncFieldReference, RoundingNumericSyncFieldProps>((props, ref) => {
    const {changeTempValue, confirmChange, isDirty, isSyncing, tempValue, value} = useNumberField(props, ref)

    const shownValue = (isDirty ? tempValue : value) as number

    const solidTempValue = useSolidValue(tempValue, 1000)
    useEffect(() => {
        if(solidTempValue !== undefined && value !== solidTempValue) {
            confirmChange()
        }
    }, [value, solidTempValue])

    return (
        <RoundingNumericBareField
            value={shownValue}
            onChange={changeTempValue}
            disabled={isSyncing || props.disabled}
            min={props.min}
            max={props.max}
            rounding={props.rounding}
            step={props.step}
        />
    )
})

export default memo(RoundingNumericField)
