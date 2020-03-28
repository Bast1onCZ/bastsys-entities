import Typography from '@material-ui/core/Typography'
import {Editor} from '@tinymce/tinymce-react'
import SmartButton from '@bast1oncz/components/dist/components/SmartButton'
import {HtmlFieldProps} from './types'
import SyncFieldType from '../syncFieldType'
import useSyncFieldImperativeHandle, {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import ChipVariables from '@bast1oncz/components/dist/components/ChipVariables'
import EditIcon from '@material-ui/icons/Edit'

import useTempValue from '../../../hooks/useTempValue'

import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import EntitySetValueRequest from '../../../logic/updateRequest/EntitySetValueRequest'
import React, {forwardRef, memo, useCallback} from 'react'

import 'tinymce/tinymce'
import useEntityContext from '../../EntityProvider/useEntityContext'
import Grid from '@material-ui/core/Grid'
import {useDynamicValidation} from '../../../hooks/useValidation'
import useResettableState from '@bast1oncz/state/dist/useResettableState'

const HtmlField = forwardRef<SyncFieldReference, HtmlFieldProps>((props, ref) => {
    const {sourceKey, updateKey, deleteKey, validate, label, disabled, variables, tinymceInit, hidden} = props
    const {entity, updateEntity} = useEntityContext()
    const {tempValue, setTempValue, resetTempValue, isActive: isDirty} = useTempValue(`${label || 'Input'} value will be lost`)
    const [isSyncing, setIsSyncing, resetIsSyncing] = useResettableState(false)

    const entityValue = toKey(sourceKey).getFrom(entity)
    const validation = useDynamicValidation(entity, entityValue, validate)

    const shownValue = tempValue !== undefined
        ? tempValue
        : entityValue

    const handleChangeConfirm = useCallback(() => {
        if (tempValue === entityValue) {
            return
        }

        const promise = updateEntity(new EntitySetValueRequest(props, tempValue))
        if (promise) {
            setIsSyncing(true)
            promise
                .then(resetTempValue)
                .finally(resetIsSyncing)
        } else {
            resetTempValue()
        }
    }, [tempValue, updateEntity])

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.HTML,
        sourceKey,
        updateKey,
        deleteKey,
        ...validation
    })

    return hidden
        ? null
        : (
            <div>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography variant="subtitle1">
                            {label}
                        </Typography>
                    </Grid>
                    {(isDirty || isSyncing) &&
                    <Grid item>
                        <SmartButton type="icon" color="secondary" loading={isSyncing}>
                            <EditIcon/>
                        </SmartButton>
                    </Grid>
                    }
                </Grid>
                {variables && variables.length > 0 &&
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography variant="body2">Variables:</Typography>
                    </Grid>
                    <Grid item>
                        <ChipVariables
                            size="small"
                            variableDefinitions={variables.map(variable => ({
                                key: `{{ ${variable} }}`,
                                label: variable
                            }))}
                        />
                    </Grid>
                </Grid>
                }
                {validation.hasError &&
                <Typography variant="body1">
                    {validation.error}
                </Typography>
                }
                <Editor
                    init={{
                        selector: 'textarea',
                        ...tinymceInit
                    }}
                    value={shownValue}
                    disabled={disabled || isSyncing}
                    onEditorChange={setTempValue}
                    onBlur={handleChangeConfirm}
                />
            </div>
        )
})
HtmlField.defaultProps = {
    tinymceInit: {
        min_height: 500,
        max_height: 500
    }
}

export default memo(HtmlField)
