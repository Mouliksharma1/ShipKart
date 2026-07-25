import { Typewriter } from "@/components/ui/typewriter";

export default function TypewriterDemo() {
  const words = ["Welcome to Typewriter", "Create beautiful effects", "With React & Tailwind", "Type away!"]

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">
          <Typewriter words={words} speed={80} delayBetweenWords={2000} cursor={true} cursorChar="|" />
        </h1> 
      </div>
    </main>
  )
}
