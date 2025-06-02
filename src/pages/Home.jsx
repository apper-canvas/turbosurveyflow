import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'builder', label: 'Survey Builder', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'share', label: 'Share & Settings', icon: 'Share2' }
  ]

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-surface-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                <ApperIcon name="ClipboardList" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">SurveyFlow</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
                Settings
              </button>
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="card-neu p-6 sticky top-24">
              <h2 className="font-semibold text-surface-800 mb-4">Navigation</h2>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow-soft'
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ApperIcon name={item.icon} className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Sparkles" className="h-5 w-5 text-accent" />
                  <span className="font-medium text-surface-800">Pro Tip</span>
                </div>
                <p className="text-sm text-surface-600">
                  Use conditional logic to create dynamic surveys that adapt based on user responses.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <MainFeature activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home