import React, {memo, MemoExoticComponent} from 'react'
import {SyncFieldDefinition} from '../../hooks/entityField/types'
import getTranslation from '../../logic/getTranslation'
import {FieldReference} from '../../logic/fieldReferences'
import {useTranslationsContext} from '../TranslationsProvider'

export interface TranslatableSyncFieldProps extends SyncFieldDefinition {
    hidden?: boolean
}

interface Identity {
    locale: string
}
type IdentityFieldReference = (identity: Identity) => FieldReference

export type TranslatedSyncFieldProps<P extends TranslatableSyncFieldProps> = Omit<P, 'sourceKey'|'updateKey'|'deleteKey'> & {
    sourceKey: IdentityFieldReference
    updateKey?: IdentityFieldReference
    deleteKey?: IdentityFieldReference
}

export type TranslatableFieldComponentType<P extends TranslatableSyncFieldProps> = MemoExoticComponent<(props: TranslatedSyncFieldProps<P>) => JSX.Element>

export default function withTranslatedField<P extends TranslatableSyncFieldProps>(FieldComponent: any): TranslatableFieldComponentType<P> {
    return memo((props: TranslatedSyncFieldProps<P>) => {
        const {
            sourceKey, updateKey, deleteKey, label, hidden,
            ...restProps
        } = props
        const {editedLanguageCode, shownLanguageCode, languages} = useTranslationsContext()

        return (
            <>
                {languages.map((language) => {
                    const {code} = language
                    const identity = {locale: code}

                    return (
                        <FieldComponent
                            {...restProps}
                            key={code}
                            sourceKey={sourceKey(identity)}
                            updateKey={updateKey && updateKey(identity)}
                            deleteKey={deleteKey && deleteKey(identity)}
                            label={label && `${label} (${getTranslation(language, 'name', shownLanguageCode)})`}
                            hidden={code !== editedLanguageCode || hidden}
                        />
                    )
                })}
            </>
        )
    })
}
