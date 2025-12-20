'use client'

interface MuscleStatus {
  muscleGroup: string
  recoveryPercent: number
  status: 'recovered' | 'recovering' | 'fatigued'
}

interface BodyDiagramProps {
  muscles: MuscleStatus[]
  size?: 'sm' | 'md' | 'lg'
}

const STATUS_COLORS = {
  recovered: '#22c55e', // green-500
  recovering: '#eab308', // yellow-500
  fatigued: '#ef4444' // red-500
}

export function BodyDiagram({ muscles, size = 'md' }: BodyDiagramProps) {
  const getColor = (muscleGroup: string) => {
    const muscle = muscles.find(m => m.muscleGroup === muscleGroup)
    if (!muscle) return '#9ca3af' // gray-400 for untrained
    return STATUS_COLORS[muscle.status]
  }

  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-32 h-44',
    lg: 'w-48 h-64'
  }

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg viewBox="0 0 100 140" className="w-full h-full">
        {/* Head */}
        <circle cx="50" cy="12" r="10" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" />
        
        {/* Neck */}
        <rect x="46" y="22" width="8" height="8" fill="#d1d5db" />
        
        {/* Shoulders */}
        <ellipse 
          cx="30" cy="35" rx="12" ry="6" 
          fill={getColor('shoulders')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        <ellipse 
          cx="70" cy="35" rx="12" ry="6" 
          fill={getColor('shoulders')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        
        {/* Chest */}
        <ellipse 
          cx="50" cy="45" rx="18" ry="12" 
          fill={getColor('chest')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        
        {/* Core */}
        <rect 
          x="38" y="55" width="24" height="25" rx="4"
          fill={getColor('core')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        
        {/* Back (shown as outline behind) */}
        <rect 
          x="35" y="30" width="30" height="50" rx="6"
          fill="none"
          stroke={getColor('back')}
          strokeWidth="3"
          strokeDasharray="4 2"
          opacity="0.6"
          className="transition-colors duration-300"
        />
        
        {/* Biceps */}
        <ellipse 
          cx="22" cy="50" rx="5" ry="12" 
          fill={getColor('biceps')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        <ellipse 
          cx="78" cy="50" rx="5" ry="12" 
          fill={getColor('biceps')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        
        {/* Triceps (shown slightly behind biceps) */}
        <ellipse 
          cx="20" cy="52" rx="4" ry="10" 
          fill={getColor('triceps')} 
          opacity="0.5"
          className="transition-colors duration-300"
        />
        <ellipse 
          cx="80" cy="52" rx="4" ry="10" 
          fill={getColor('triceps')} 
          opacity="0.5"
          className="transition-colors duration-300"
        />
        
        {/* Forearms */}
        <rect x="18" y="62" width="8" height="18" rx="3" fill="#d1d5db" />
        <rect x="74" y="62" width="8" height="18" rx="3" fill="#d1d5db" />
        
        {/* Legs */}
        <ellipse 
          cx="42" cy="95" rx="8" ry="20" 
          fill={getColor('legs')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        <ellipse 
          cx="58" cy="95" rx="8" ry="20" 
          fill={getColor('legs')} 
          opacity="0.8"
          className="transition-colors duration-300"
        />
        
        {/* Lower legs */}
        <rect x="37" y="115" width="10" height="20" rx="4" fill="#d1d5db" />
        <rect x="53" y="115" width="10" height="20" rx="4" fill="#d1d5db" />
      </svg>

      {/* Legend */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Ready</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-muted-foreground">Recovering</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Fatigued</span>
        </div>
      </div>
    </div>
  )
}
