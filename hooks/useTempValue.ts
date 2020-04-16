import useResettableState from '@bast1oncz/state/useResettableState'
import useLeaveConfirm from 'leave-confirm/dist/useLeaveConfirm'

interface TempValueHookResult<T> {
  tempValue: T|undefined,
  setTempValue: (value?: T) => void,
  resetTempValue: () => void,
  isActive: boolean
}

/**
 * Hook to use tempValue.
 * Temp value is a state value, that is considered active when tempValue !== undefined.
 * If active, a leave confirm hook is used.
 * Can be set by setTempValue(value)
 * Can be deactivated by resetTempValue() or setTempValue(undefined)
 *
 * @param {string} leaveConfirmMessage
 * @returns {{resetTempValue: function, setTempValue: function, tempValue: any|undefined, isActive: boolean}}
 */
export default function useTempValue<T>(leaveConfirmMessage: string): TempValueHookResult<T> {
  const [tempValue, setTempValue, resetTempValue] = useResettableState<T|undefined>(undefined)
  const isActive = tempValue !== undefined
  
  useLeaveConfirm(leaveConfirmMessage, isActive)
  
  return {
    tempValue,
    setTempValue,
    resetTempValue,
    isActive
  }
}
