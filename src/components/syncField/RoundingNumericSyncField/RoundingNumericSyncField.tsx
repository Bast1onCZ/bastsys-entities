import React, {forwardRef, memo, useEffect} from 'react'
import {useNumberField} from '../../../index'
import RoundingNumericField from '@bast1oncz/components/dist/form/RoundingNumericField'
import useSolidValue from '@bast1oncz/state/dist/useSolidValue'
import {RoundingNumericSyncFieldProps} from './types'

const RoundingNumericSyncField = forwardRef<any, RoundingNumericSyncFieldProps>((props, ref) => {
    const {sync, ...restProps} = props
    const {changeTempValue, confirmChange, isDirty, isSyncing, tempValue, validation, value} = useNumberField(sync, ref)

    const shownValue = (isDirty ? tempValue : value) as number

    const solidTempValue = useSolidValue(tempValue, 1000)
    useEffect(() => {
        if(solidTempValue !== undefined && value !== solidTempValue) {
            confirmChange()
        }
    }, [value, solidTempValue])

    return (
        <RoundingNumericField
            {...restProps}
            value={shownValue}
            onChange={changeTempValue}
            disabled={isSyncing || restProps.disabled}
        />
    )
})

export default memo(RoundingNumericSyncField)
