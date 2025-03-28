
import { User, DollarSign, ShieldCheck, Clock, Car, Award, PercentCircle, Zap } from 'lucide-react';

const Benefits = () => {
  const riderBenefits = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Save Time",
      description: "Book in seconds and get picked up within minutes."
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Safety First",
      description: "All drivers are verified and trips are monitored."
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Transparent Pricing",
      description: "No hidden charges. Pay only what you see upfront."
    },
    {
      icon: <PercentCircle className="h-5 w-5" />,
      title: "Regular Discounts",
      description: "Enjoy frequent promotions and loyalty rewards."
    }
  ];

  const driverBenefits = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Be Your Own Boss",
      description: "Work on your own schedule with flexible hours."
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Earn More",
      description: "Competitive rates with bonus opportunities."
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: "Vehicle Support",
      description: "Maintenance assistance and fuel discounts."
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Rewards Program",
      description: "Earn points and unlock exclusive benefits."
    }
  ];

  return (
    <section id="benefits" className="section-padding bg-gray-50 dark:bg-gocabs-dark">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">Benefits for <span className="gradient-text">Everyone</span></h2>
          <p className="text-gray-600 dark:text-gray-300">
            GoCabs creates value for both riders and drivers with features designed to make transportation better for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Rider Benefits */}
          <div className="bg-white dark:bg-gocabs-secondary/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gocabs-primary/10 rounded-lg mr-4">
                <User className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="heading-3 text-gocabs-secondary dark:text-white">For Riders</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riderBenefits.map((benefit, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="flex items-start">
                    <div className="p-2 bg-gocabs-primary/10 rounded-lg mr-3 mt-1">
                      <div className="text-gocabs-primary">
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gocabs-secondary dark:text-white mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gocabs-dark/50 rounded-lg">
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                "GoCabs has transformed my daily commute. The eco-friendly options and driver quality make it my go-to ride service." 
                <span className="font-medium block mt-2">- Sarah J., Daily Rider</span>
              </p>
            </div>
          </div>
          
          {/* Driver Benefits */}
          <div className="bg-white dark:bg-gocabs-secondary/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gocabs-primary/10 rounded-lg mr-4">
                <Car className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="heading-3 text-gocabs-secondary dark:text-white">For Drivers</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {driverBenefits.map((benefit, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="flex items-start">
                    <div className="p-2 bg-gocabs-primary/10 rounded-lg mr-3 mt-1">
                      <div className="text-gocabs-primary">
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gocabs-secondary dark:text-white mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gocabs-dark/50 rounded-lg">
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                "The flexibility and earning potential with GoCabs is unmatched. Their rewards program keeps me motivated to provide excellent service."
                <span className="font-medium block mt-2">- Michael T., Driver for 2 years</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
