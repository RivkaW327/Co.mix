import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { motion } from 'framer-motion';
import { BookOpen, Brush, Zap } from 'lucide-react';
import ComixLogo from '../assets/comixLogo';
import imgComixLogo from '../assets/comix_logo.png';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-primary-yellow">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                {/* <img src={imgComixLogo} width={'300px'} alt="Co.mix logo" /> */}
                <ComixLogo width={300} height={150} />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl mb-6 font-comic"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-primary-blue">Transform</span> Your Books Into <span className="text-primary-red">Comics</span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-neutral-600 max-w-3xl mb-8 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Upload your books and our AI-powered system will transform them into vibrant, 
                engaging comics that bring your stories to life in a whole new way.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                  Get Started
                </Link>
                <Link to="/login" className="btn bg-white border border-neutral-300 text-neutral-800 text-lg px-8 py-4 hover:bg-neutral-50">
                  Sign In
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl md:text-4xl text-center mb-12 font-comic">How Does It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="card p-6"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary-yellow bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="text-primary-yellow w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2 font-semibold">1. Upload Your Book</h3>
                <p className="text-neutral-600">
                  Simply upload your PDF book file to our secure platform.
                </p>
              </motion.div>

              <motion.div 
                className="card p-6"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary-green bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Zap className="text-primary-green w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2 font-semibold">2. AI Transformation</h3>
                <p className="text-neutral-600">
                  Our advanced AI analyzes your content and transforms it into comic-style artwork.
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-6"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary-red bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Brush className="text-primary-red w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2 font-semibold">3. Download & Share</h3>
                <p className="text-neutral-600">
                  Download your comic as a PDF and share your newly visualized story with the world.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-blue to-primary-green text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl mb-6 font-comic">Ready to Transform Your Books?</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Join thousands of authors and readers who are bringing their stories to life in a whole new way.
            </p>
            <Link to="/register" className="btn bg-white text-primary-yellow hover:bg-neutral-100 text-lg px-8 py-4">
              Create Your First Comic
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <ComixLogo width={150} height={75} />
            </div>
            <div className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Co.mix. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;