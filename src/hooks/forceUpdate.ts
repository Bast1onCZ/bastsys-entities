import {useCallback, useState} from 'react'

/**
 * Returns a function that is used to force update component
 */
export default function useForceUpdate(): VoidFunction {
    const [, setState] = useState(0)

    return useCallback(() => setState(state => state + 1), [])
}
