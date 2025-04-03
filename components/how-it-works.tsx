import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Connect Your Social Accounts",
      description: "YouTube, TikTok, Instagram (and more coming)",
      icon: "🔗",
    },
    {
      number: "2",
      title: "AI Analyzes Your Content",
      description: "Identifies trends, topics, and audience behavior",
      icon: "🧠",
    },
    {
      number: "3",
      title: "Get Personalized Content Ideas",
      description: "Tailored suggestions to boost engagement and creativity",
      icon: "💡",
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 relative">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <div className="w-12 h-12 bg-violet-700 rounded-full flex items-center justify-center mb-6 text-white font-bold">
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
            <p className="text-gray-600 mb-4">{step.description}</p>
            <div className="text-4xl">{step.icon}</div>
          </div>

          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
              <ArrowRight className="text-violet-400" size={24} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

