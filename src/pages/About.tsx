import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            About African Snakie
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Connecting African snack lovers around the world with authentic flavors from the continent.
          </motion.p>
        </div>
        
        {/* Our Story */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <img
                src="https://images.pexels.com/photos/6969882/pexels-photo-6969882.jpeg"
                alt="Our Story"
                className="rounded-lg shadow-md w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                African Snakie was born from a simple realization: the rich tapestry of African snacks was largely inaccessible to many who craved these authentic flavors. Our founder, who grew up enjoying these treats, found it challenging to find them after moving abroad.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small collection of snacks shared among friends grew into a passion project to connect people with the diverse and delicious snacks from across Africa.
              </p>
              <p className="text-gray-600">
                Today, African Snakie partners directly with local producers across the continent to bring you the most authentic and high-quality African snacks, while supporting local communities and preserving cultural food traditions.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Mission & Values */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're on a mission to share the authentic taste of Africa with the world while empowering local communities.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-green-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-3">Authenticity</h3>
              <p className="text-gray-700">
                We are committed to providing genuine, traditional African snacks that stay true to their cultural roots and recipes.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-green-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-3">Community</h3>
              <p className="text-gray-700">
                We support local producers and communities across Africa by providing fair trade opportunities and sustainable business practices.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-green-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-3">Quality</h3>
              <p className="text-gray-700">
                We never compromise on quality, ensuring that every snack meets our high standards for taste, freshness, and safety.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Team */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our diverse team shares a passion for African culture, food, and creating exceptional customer experiences.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Amara Okafor',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                bio: 'Passionate about sharing African culture through food.'
              },
              {
                name: 'Kwame Mensah',
                role: 'Operations Manager',
                image: 'https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                bio: 'Ensures your snacks arrive fresh and on time.'
              },
              {
                name: 'Fatima Diallo',
                role: 'Product Curator',
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                bio: 'Discovers the best snacks from across Africa.'
              },
              {
                name: 'Daniel Mwangi',
                role: 'Community Manager',
                image: 'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                bio: 'Connects with customers and African producers.'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover rounded-full mx-auto shadow-md"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-green-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-green-50 p-8 rounded-lg text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            We are an online-only store, delivering fresh African snacks straight to your door! Contact us anytime for questions or support.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm">
            <div className="flex items-center">
              <span className="font-medium">Phone/WhatsApp:</span>
              <span className="ml-2">+1 555 (123-4567)</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Email:</span>
              <span className="ml-2">info@foodie.com</span>
            </div>
          </div>
          <div className="mt-6">
            <a
              href="/contact"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;