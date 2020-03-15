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
  const chargeRef = useRef<boolean>()
  chargeRef.current = true
  
  useEffect(() => {
    const id = setInterval(() => {
      if (!disabled && chargeRef.current && ref.current?.isPrepared && !ref.current?.hasError) {
        chargeRef.current = false
        listener()
      }
    }, 100)
    
    return () => clearTimeout(id)
  }, [disabled, listener])
}
