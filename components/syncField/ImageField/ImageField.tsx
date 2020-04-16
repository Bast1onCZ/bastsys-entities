import {toKey} from '@bast1oncz/objects/ObjectPathKey'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import SmartButton from '@bast1oncz/components/components/SmartButton'
import {ImageFieldProps} from './types'
import SyncFieldType from '../syncFieldType'
import useSyncFieldImperativeHandle, {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import ImageMimeType from './ImageMimeType'
import useResettableState from '@bast1oncz/state/useResettableState'
import useFileDialog from '@bast1oncz/components/hooks/input/useFileDialog'

import ImagePlaceholder from './ImagePlaceholder.png'
import EntityDeleteValueRequest from '../../../logic/updateRequest/EntityDeleteValueRequest'
import EntitySetFileValueRequest from '../../../logic/updateRequest/EntitySetFileValueRequest'
import React, {CSSProperties, forwardRef, memo, useCallback} from 'react'
import {useEntityContext} from '../../EntityProvider/EntityContext'
import useIncrementalIdState from '@bast1oncz/state/useIncrementalIdState'
import ImmediatePromise from '@bast1oncz/objects/ImmediatePromise'
import {useDynamicValidation} from '../../../hooks/useValidation'

const IMAGE_SOURCE_TYPE = {
    DATA_URL: 1,
    LINK: 2
}

const mediaStyle: CSSProperties = {
    height: 100,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
}

const DEFAULT_ENTITY_VALUE = {link: ImagePlaceholder}

/**
 * @param value
 * @returns {boolean|number}
 */
function isValidValue(value) {
    if (typeof value?.content === 'string') {
        return IMAGE_SOURCE_TYPE.DATA_URL
    }
    if (typeof value?.link === 'string') {
        return IMAGE_SOURCE_TYPE.LINK
    }

    return false
}

const ImageField = forwardRef<SyncFieldReference, ImageFieldProps>((props, ref) => {
    const {sourceKey, updateKey, deleteKey, validate, label, mimeTypes = Object.values(ImageMimeType), hidden, deletable, disabled} = props

    const {entity, updateEntity, readonly: entityDisabled} = useEntityContext()

    const rawEntityValue = toKey(props.sourceKey).getFrom(entity)
    const valueType = isValidValue(rawEntityValue)
    const entityValue = valueType ? rawEntityValue : DEFAULT_ENTITY_VALUE
    const validation = useDynamicValidation(entity, rawEntityValue, validate)

    // update
    const [isUpdating, setIsUpdating, resetIsUpdating] = useResettableState(false)
    const [reloadKey, changeReloadKey] = useIncrementalIdState()
    const handleFileUpload = useCallback(files => {
        const file = files[0]

        setIsUpdating(true)
        const promise = updateEntity(new EntitySetFileValueRequest(props, file)) || new ImmediatePromise()
        promise.then(possibleResponse => possibleResponse?.data && changeReloadKey()) // only if returned graphql response, reloadKey is changed
            .finally(resetIsUpdating)
    }, [updateEntity, props.sourceKey, props.updateKey])
    const openFileDialog = useFileDialog({accept: mimeTypes.join(), onConfirm: handleFileUpload})

    // delete
    const [isDeleting, setIsDeleting, resetIsDeleting] = useResettableState(false)
    const handleFileDelete = useCallback(() => {
        setIsDeleting(true)
        const promise = updateEntity(new EntityDeleteValueRequest(props)) || new Promise(resolve => resolve())
        promise.finally(resetIsDeleting)
    }, [updateEntity, props.sourceKey, props.updateKey, props.deleteKey])

    const isSyncing = isUpdating || isDeleting
    const imageUrl = valueType !== IMAGE_SOURCE_TYPE.DATA_URL
        ? entityValue.link + `?reload=${reloadKey}`
        : `data:${entityValue.mimeType};base64,${entityValue.content}`

    useSyncFieldImperativeHandle(ref, {
        type: SyncFieldType.IMAGE,
        sourceKey,
        updateKey,
        deleteKey,
        ...validation
    })

    return hidden
        ? null
        : (
            <Card>
                {label &&
                <CardHeader
                    title={label}
                />
                }
                <CardMedia
                    style={mediaStyle}
                    image={imageUrl}
                />
                <CardActions>
                    {deletable &&
                    <SmartButton
                        color="secondary"
                        variant="contained"
                        disabled={!valueType || isSyncing || disabled || entityDisabled}
                        loading={isDeleting}
                        onClick={handleFileDelete}
                    >
                        Delete
                    </SmartButton>
                    }
                    <SmartButton
                        color="primary"
                        variant="contained"
                        disabled={isSyncing || disabled || entityDisabled}
                        loading={isUpdating}
                        onClick={openFileDialog}
                    >
                        Upload
                    </SmartButton>
                </CardActions>
            </Card>
        )
})
ImageField.defaultProps = {
    mimeTypes: Object.values(ImageMimeType)
}

export default memo(ImageField)
