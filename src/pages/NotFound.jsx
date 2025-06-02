import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card-neu p-12 max-w-md mx-auto"
        >
          <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-surface-800 mb-4">Page Not Found</h2>
          <p className="text-surface-600 mb-8">
            The survey you're looking for might have been moved or doesn't exist.
          </p>
          
          <Link to="/" className="btn-primary inline-flex items-center">
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound