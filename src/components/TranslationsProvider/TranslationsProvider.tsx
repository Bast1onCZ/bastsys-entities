import React, {memo, ReactNode} from 'react'
import {TranslationsContextValue} from './TranslationsContext'

interface TranslationsProviderProps extends TranslationsContextValue {
    children: ReactNode
}

function TranslationsProvider(props: TranslationsProviderProps) {
    const {children, ...restProps} = props

    return (
        <TranslationsProvider {...restProps}>
            {children}
        </TranslationsProvider>
    )
}

export default memo(TranslationsProvider)
