import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Headphones, 
  BarChart3, 
  Shield,
  Zap,
  Target
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from professional traders with years of market experience"
  },
  {
    icon: Users,
    title: "Live Trading Sessions",
    description: "Watch real trades happen and learn decision-making in real-time"
  },
  {
    icon: Trophy,
    title: "Proven Strategies",
    description: "Time-tested trading strategies that actually work in today's markets"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Get help whenever you need it with our dedicated support team"
  },
  {
    icon: BarChart3,
    title: "Advanced Tools",
    description: "Access professional-grade trading tools and market analysis"
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Learn to protect your capital with proper risk management techniques"
  },
  {
    icon: Zap,
    title: "Quick Results",
    description: "Start seeing improvements in your trading within the first month"
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description: "Customized learning paths based on your experience and goals"
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">TheLastTrade</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We provide everything you need to become a successful trader
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="glass border-white/10 hover:border-white/20 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 w-fit group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}