"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqAccordion() {
  const faqItems = [
    {
      question: "How does it work?",
      answer:
        "We analyze your past content, performance metrics, and trends using AI. Our algorithms identify patterns in your successful content and generate new ideas that align with your style and audience preferences.",
    },
    {
      question: "Is this just for YouTube?",
      answer:
        "Nope! We support multiple platforms including TikTok and Instagram, with more on the way. Our AI is trained to understand the nuances of different platforms and generate ideas that work best for each one.",
    },
    {
      question: "Is there a free version?",
      answer:
        "Yes! Get started with a free plan that gives you a limited number of content ideas per month. Upgrade anytime for more features, including advanced analytics and unlimited idea generation.",
    },
    {
      question: "How accurate are the content ideas?",
      answer:
        "Our AI analyzes your specific content style and audience engagement patterns to generate highly relevant ideas. The more content you have, the more accurate and personalized the suggestions will be.",
    },
    {
      question: "Can I customize the type of content ideas I receive?",
      answer:
        "You can set preferences for content types, themes, and formats. Our AI will prioritize generating ideas that match your specified parameters while still optimizing for engagement.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
          <AccordionTrigger className="text-left font-medium py-4 text-gray-900 hover:text-violet-700">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 pb-4">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

