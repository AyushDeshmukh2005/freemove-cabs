
import React from 'react';
import { 
  Calendar, Package, Award, Accessibility, Leaf, 
  Wifi, Shield, Users
} from 'lucide-react';

const UniqueFeatures = () => {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-gocabs-primary" />,
      title: "Subscription-based ride packages",
      description: "Weekly and monthly subscription plans for regular commuters, providing consistent service and cost savings."
    },
    {
      icon: <Award className="h-10 w-10 text-gocabs-primary" />,
      title: "Driver training certification system",
      description: "Built-in certification process for drivers, with professional training modules and verification."
    },
    {
      icon: <Users className="h-10 w-10 text-gocabs-primary" />,
      title: "Community-based carpooling",
      description: "Allows users in similar areas to form commuting groups with regular schedules, reducing costs and environmental impact."
    },
    {
      icon: <Accessibility className="h-10 w-10 text-gocabs-primary" />,
      title: "Inclusive design for visually impaired users",
      description: "Special accessibility features with voice navigation specifically designed for visually impaired users."
    },
    {
      icon: <Leaf className="h-10 w-10 text-gocabs-primary" />,
      title: "Carbon footprint calculation",
      description: "See the environmental impact of your journey choices and get rewarded for choosing eco-friendly options."
    },
    {
      icon: <Wifi className="h-10 w-10 text-gocabs-primary" />,
      title: "Offline booking capability",
      description: "Schedule rides even without an active internet connection, ensuring reliability in all situations."
    },
    {
      icon: <Shield className="h-10 w-10 text-gocabs-primary" />,
      title: "Emergency SOS with direct police integration",
      description: "Direct integration with local police networks for immediate response in emergency situations."
    },
    {
      icon: <Package className="h-10 w-10 text-gocabs-primary" />,
      title: "Ride sharing based on interest matching",
      description: "Matches riders with similar interests or professions for a more engaging journey experience."
    }
  ];

  return (
    <section id="unique-features" className="section-padding bg-gray-50 dark:bg-gocabs-dark/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4 gradient-text">Unique Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            FreeMove Cabs goes beyond traditional ride-hailing with exclusive features 
            designed for modern commuters. Our innovative approach prioritizes community, 
            accessibility, and sustainability while offering unmatched convenience to both 
            riders and drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card flex flex-col items-center text-center hover:border-gocabs-primary transition-all duration-300 p-6 h-full"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gocabs-secondary dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniqueFeatures;
