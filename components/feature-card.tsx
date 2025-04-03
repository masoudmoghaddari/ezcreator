import { Lightbulb, TrendingUp, Clock, type LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const getIcon = (): LucideIcon => {
    switch (icon) {
      case "Lightbulb":
        return Lightbulb
      case "TrendingUp":
        return TrendingUp
      case "Clock":
        return Clock
      default:
        return Lightbulb
    }
  }

  const Icon = getIcon()

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="text-violet-700" size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

