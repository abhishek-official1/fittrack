'use client'

import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  unit?: string
  size?: 'sm' | 'md' | 'lg'
}

export function NumberInput({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  unit,
  size = 'md'
}: NumberInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(Math.round(newValue * 100) / 100)
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(Math.round(newValue * 100) / 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  const sizeStyles = {
    sm: {
      button: 'h-10 w-10 text-lg',
      input: 'text-xl w-16',
      container: 'gap-1'
    },
    md: {
      button: 'h-14 w-14 text-2xl',
      input: 'text-3xl w-20',
      container: 'gap-2'
    },
    lg: {
      button: 'h-16 w-16 text-3xl',
      input: 'text-4xl w-24',
      container: 'gap-3'
    }
  }

  const styles = sizeStyles[size]

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-muted-foreground mb-2 font-medium">{label}</span>
      <div className={`flex items-center ${styles.container}`}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`${styles.button} rounded-full font-bold active:scale-95 transition-transform`}
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={handleInputChange}
            className={`${styles.input} text-center font-bold bg-transparent border-none outline-none focus:ring-0`}
          />
          {unit && (
            <span className="block text-sm text-muted-foreground -mt-1">{unit}</span>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`${styles.button} rounded-full font-bold active:scale-95 transition-transform`}
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
