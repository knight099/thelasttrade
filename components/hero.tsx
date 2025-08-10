import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Master the Art of{' '}
            <span className="gradient-text">Stock Trading</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Transform your financial future with expert-led courses, live trading sessions, 
            and personalized mentoring from professional traders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-6"
            >
              Start Learning Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="glass rounded-lg p-6">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">10,000+</h3>
              <p className="text-gray-300">Students Trained</p>
            </div>
            <div className="glass rounded-lg p-6">
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">95%</h3>
              <p className="text-gray-300">Success Rate</p>
            </div>
            <div className="glass rounded-lg p-6">
              <DollarSign className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">₹50L+</h3>
              <p className="text-gray-300">Average Returns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}