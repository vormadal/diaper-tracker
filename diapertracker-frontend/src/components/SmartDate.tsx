import React, { useEffect, useState } from 'react'
import { smartFormatDate } from '../utils/DateUtils'

type Props = { date: Date }

const SmartDate = ({ date }: Props) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    const updateValue = () => {
      setValue(smartFormatDate(date))
    }
    const handle = setInterval(updateValue, 30000)
    updateValue()
    return () => clearInterval(handle)
  }, [date])
  return <>{value}</>
}

export default SmartDate
