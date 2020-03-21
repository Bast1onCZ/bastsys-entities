import {RefObject, useEffect, useRef} from 'react'
import {EntityProviderReference} from './types'

/**
 * Triggers given listener function, when entity can be created. Can be triggered max once per render
 *
 * @param ref
 * @param disabled
 * @param listener
 */
export default function useValidEntityListener(ref: RefObject<EntityProviderReference>, listener: VoidFunction, disabled: boolean = false): void {
  const lastChange = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now()
      if (!disabled && (now - lastChange.current > 10 * 1000) && ref.current?.isPrepared && ref.current?.isValid) {
        lastChange.current = now
        listener()
      }
    }, 100)
    
    return () => clearTimeout(id)
  }, [disabled, listener])
}
