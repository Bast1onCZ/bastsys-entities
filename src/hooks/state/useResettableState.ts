import {Dispatch, SetStateAction, useCallback, useState} from 'react'

export type UseResettableState<T> = [
    T,
    Dispatch<SetStateAction<T>>,
    VoidFunction
]

export default function useResettableState<T>(defaultValue: T): UseResettableState<T> {
    const [state, setState] = useState<T>(defaultValue)
    const resetState = useCallback(() => setState(defaultValue), [])

    return [state, setState, resetState]
}
