import React, {forwardRef, memo, useEffect} from 'react'
import {useNumberField} from '../../../index'
import useSolidValue from '@bast1oncz/state/dist/useSolidValue'
import RoundingNumericBareField from '@bast1oncz/components/dist/components/form/RoundingNumericField'
import {RoundingNumericSyncFieldProps} from './types'

const RoundingNumericField = forwardRef<any, RoundingNumericSyncFieldProps>((props, ref) => {
    const {sync, ...restProps} = props
    const {changeTempValue, confirmChange, isDirty, isSyncing, tempValue, value} = useNumberField(sync, ref)

    const shownValue = (isDirty ? tempValue : value) as number

    const solidTempValue = useSolidValue(tempValue, 1000)
    useEffect(() => {
        if(solidTempValue !== undefined && value !== solidTempValue) {
            confirmChange()
        }
    }, [value, solidTempValue])

    return (
        <RoundingNumericBareField
            {...restProps}
            value={shownValue}
            onChange={changeTempValue}
            disabled={isSyncing || restProps.disabled}
        />
    )
})

export default memo(RoundingNumericField)
