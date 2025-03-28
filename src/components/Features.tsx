
import { 
  MapPin, 
  Navigation, 
  CreditCard, 
  Star, 
  History, 
  AlertTriangle, 
  Brain, 
  Leaf, 
  Palette, 
  Trophy 
} from 'lucide-react';

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Ride Booking",
      description: "Book rides instantly with our real-time allocation system that matches you with nearby drivers."
    },
    {
      icon: <Navigation className="h-6 w-6" />,
      title: "Live Tracking",
      description: "Track your ride in real-time with accurate GPS positioning and estimated arrival times."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Multiple Payments",
      description: "Pay with credit/debit cards, UPI, or maintain a wallet balance for quick checkouts."
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Ratings & Reviews",
      description: "Rate your drivers and provide feedback to help improve service quality."
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Ride History",
      description: "Access your complete ride history with detailed invoices for each trip."
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Emergency SOS",
      description: "One-tap SOS button to send your location to emergency contacts and alert our support team."
    }
  ];

  const uniqueFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Ride Sharing",
      description: "Our AI suggests shared rides based on routes and schedules, saving you money and reducing emissions."
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Eco-Friendly Mode",
      description: "Choose electric or hybrid vehicles and get special discounts while helping the environment."
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Custom Themes",
      description: "Personalize your app with custom themes and toggle between light and dark modes."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Driver Rewards",
      description: "Drivers earn points for excellent service, completing milestones and maintaining high ratings."
    }
  ];

  return (
    <section id="features" className="section-padding bg-gray-50 dark:bg-gocabs-dark">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">Powerful Features for <span className="gradient-text">Modern Riders</span></h2>
          <p className="text-gray-600 dark:text-gray-300">
            GoCabs combines essential ride-sharing functionality with innovative features that enhance your experience.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="feature-card animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
              <div className="inline-flex items-center justify-center p-3 rounded-lg bg-gocabs-primary/10 text-gocabs-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gocabs-secondary dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Unique Features Section */}
        <div className="bg-white dark:bg-gocabs-secondary/30 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="heading-3 mb-4">What Makes GoCabs <span className="gradient-text">Stand Out</span></h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Beyond the standard ride-sharing experience, GoCabs offers unique features that prioritize sustainability, personalization, and rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-gocabs-primary to-gocabs-accent text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gocabs-secondary dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
