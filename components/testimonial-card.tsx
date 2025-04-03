interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatar: string
}

export default function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="mb-6">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.667 13.333H5.33366C5.33366 8 9.33366 5.333 13.3337 5.333L12.0003 8C10.667 9.333 10.667 11.333 10.667 13.333ZM21.3337 13.333H16.0003C16.0003 8 20.0003 5.333 24.0003 5.333L22.667 8C21.3337 9.333 21.3337 11.333 21.3337 13.333Z"
            fill="#9333EA"
            fillOpacity="0.2"
          />
          <path
            d="M5.33366 14.667H10.667V20.0003C10.667 20.7076 10.3861 21.3858 9.88599 21.8859C9.38589 22.386 8.70776 22.667 8.00033 22.667H8.00033C7.2929 22.667 6.61476 22.386 6.11466 21.8859C5.61457 21.3858 5.33366 20.7076 5.33366 20.0003V14.667ZM16.0003 14.667H21.3337V20.0003C21.3337 20.7076 21.0528 21.3858 20.5527 21.8859C20.0526 22.386 19.3744 22.667 18.667 22.667H18.667C17.9596 22.667 17.2814 22.386 16.7813 21.8859C16.2812 21.3858 16.0003 20.7076 16.0003 20.0003V14.667Z"
            fill="#9333EA"
          />
        </svg>
      </div>
      <p className="text-gray-700 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <img src={avatar || "/placeholder.svg"} alt={author} className="w-10 h-10 rounded-full mr-3 object-cover" />
        <div>
          <div className="font-medium text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  )
}

