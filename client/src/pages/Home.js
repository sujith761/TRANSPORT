import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bus,
  FileText,
  RefreshCw,
  XCircle,
  Map,
  Shield,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Secure Journey',
      description: 'GPS tracking and 24/7 monitoring ensures your safety.',
      color: 'bg-emerald-500'
    },
    {
      icon: Clock,
      title: 'Punctual Service',
      description: 'Timely pick-up and drop services for all routes.',
      color: 'bg-orange-500'
    },
    {
      icon: Users,
      title: 'Student Friendly',
      description: 'Affordable rates designed specifically for students.',
      color: 'bg-violet-500'
    }
  ];

  const mainActions = [
    {
      title: 'Apply for Transport',
      description: 'New to college transport? Start your application here.',
      icon: FileText,
      path: '/apply',
      gradient: 'from-blue-500 to-indigo-600',
      delay: 0
    },
    {
      title: 'View Routes',
      description: 'Check available bus routes and pick-up points.',
      icon: Map,
      path: '/routes',
      gradient: 'from-violet-500 to-purple-600',
      delay: 0.1
    },
  ];

  const secondaryActions = [
    {
      title: 'Change Route',
      icon: RefreshCw,
      path: '/change-route',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Cancel Route',
      icon: XCircle,
      path: '/cancel-route',
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 md:p-12 overflow-hidden relative"
        >
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 font-medium text-sm mb-6 border border-blue-200"
              >
                👋 Welcome back, {user?.name.split(' ')[0]}
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Your Campus Journey <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Starts Here
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Manage your daily commute with ease. Apply for transport, track buses, and manage your subscription all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary flex items-center shadow-blue-500/25"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex justify-end relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                  <Bus className="h-32 w-32 text-white/90" />
                </div>
              </motion.div>

              {/* Decorative elements behind bus */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob" />
              <div className="absolute -bottom-8 right-20 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Actions Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {mainActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(action.path)}
              className="group cursor-pointer"
            >
              <div className={`h-full relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${action.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm mb-6">
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                    <p className="text-blue-100">{action.description}</p>
                  </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Secondary Actions & Features */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Manage Route */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Manage Transport</h3>
          <div className="glass-panel rounded-2xl p-2 space-y-2">
            {secondaryActions.map((action) => (
              <motion.button
                key={action.title}
                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.8)' }}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center p-4 rounded-xl transition-all group hover:shadow-sm"
              >
                <div className={`${action.bg} ${action.color} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-slate-800">{action.title}</h4>
                  <p className="text-xs text-slate-500">Update your preferences</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Why Choose Us?</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="glass-card rounded-2xl p-5 hover:bg-white transition-colors"
              >
                <div className={`${feature.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4 shadow-md`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
