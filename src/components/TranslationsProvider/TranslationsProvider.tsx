import React, {memo, ReactNode} from 'react'
import TranslationsContext , {TranslationsContextValue} from './TranslationsContext'

interface TranslationsProviderProps extends TranslationsContextValue {
    children: ReactNode
}

function TranslationsProvider(props: TranslationsProviderProps) {
    const {children, ...restProps} = props

    return (
        <TranslationsContext.Provider value={restProps}>
            {children}
        </TranslationsContext.Provider>
    )
}

export default memo(TranslationsProvider)
