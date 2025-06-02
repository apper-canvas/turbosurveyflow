import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ activeTab }) => {
  const [surveys, setSurveys] = useState([
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Measure customer satisfaction with our products',
      createdAt: new Date('2024-01-15'),
      responses: 42,
      status: 'active',
      questions: [
        { id: '1', type: 'rating', text: 'How satisfied are you with our service?', required: true },
        { id: '2', type: 'multiple', text: 'Which product did you purchase?', options: ['Product A', 'Product B', 'Product C'] }
      ]
    },
    {
      id: '2', 
      title: 'Employee Feedback Form',
      description: 'Collect feedback from team members',
      createdAt: new Date('2024-01-10'),
      responses: 18,
      status: 'draft',
      questions: []
    }
])

  const [currentSurvey, setCurrentSurvey] = useState(null)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState({ type: 'text', text: '', required: false, options: [] })
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [showConditionalBuilder, setShowConditionalBuilder] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
const [editingQuestion, setEditingQuestion] = useState(null)

  const questionTypes = [
    { id: 'text', label: 'Short Text', icon: 'Type', description: 'Single line text input' },
    { id: 'multiple', label: 'Multiple Choice', icon: 'CheckSquare', description: 'Select one option' },
    { id: 'rating', label: 'Rating Scale', icon: 'Star', description: '1-5 star rating' },
    { id: 'dropdown', label: 'Dropdown', icon: 'ChevronDown', description: 'Select from dropdown' }
  ]
  const conditionTypes = [
    { id: 'equals', label: 'equals' },
    { id: 'not_equals', label: 'does not equal' },
    { id: 'contains', label: 'contains' },
    { id: 'greater_than', label: 'is greater than' },
    { id: 'less_than', label: 'is less than' },
    { id: 'is_empty', label: 'is empty' },
    { id: 'is_not_empty', label: 'is not empty' }
  ]

  const actionTypes = [
    { id: 'show_question', label: 'Show Question' },
    { id: 'hide_question', label: 'Hide Question' },
    { id: 'jump_to_question', label: 'Jump to Question' },
    { id: 'skip_to_end', label: 'Skip to End' }
  ]

  useEffect(() => {
    if (currentSurvey) {
      setQuestions(currentSurvey.questions || [])
    }
  }, [currentSurvey])

  const handleCreateSurvey = (title, description) => {
    const newSurvey = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date(),
      responses: 0,
      status: 'draft',
      questions: []
    }
    setSurveys([newSurvey, ...surveys])
    toast.success('Survey created successfully!')
  }

  const handleDeleteSurvey = (id) => {
    setSurveys(surveys.filter(survey => survey.id !== id))
    toast.success('Survey deleted successfully!')
  }

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast.error('Please enter a question text')
      return
}

    const question = {
      id: Date.now().toString(),
      ...newQuestion,
      order: questions.length + 1,
      conditionalLogic: {
        conditions: [],
        actions: []
      }
    }

    setQuestions([...questions, question])
    setNewQuestion({ type: 'text', text: '', required: false, options: [] })
    setShowQuestionForm(false)
    toast.success('Question added successfully!')
  }

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
toast.success('Question removed!')
  }

  const generateShareLink = (surveyId) => {
    const link = `${window.location.origin}/survey/${surveyId}`
    navigator.clipboard.writeText(link)
    toast.success('Survey link copied to clipboard!')
  }
const handleUpdateConditionalLogic = (questionId, conditionalLogic) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, conditionalLogic } : q
    ))
  }
  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-800">Survey Dashboard</h2>
          <p className="text-surface-600">Manage and monitor your surveys</p>
        </div>
        <CreateSurveyModal onCreateSurvey={handleCreateSurvey} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Surveys', value: surveys.length, icon: 'FileText', color: 'primary' },
          { label: 'Active Surveys', value: surveys.filter(s => s.status === 'active').length, icon: 'Activity', color: 'secondary' },
          { label: 'Total Responses', value: surveys.reduce((acc, s) => acc + s.responses, 0), icon: 'Users', color: 'accent' },
          { label: 'Avg. Response Rate', value: '78%', icon: 'TrendingUp', color: 'primary' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-neu p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                <ApperIcon name={stat.icon} className={`h-6 w-6 text-${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Survey List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {surveys.map((survey, index) => (
          <motion.div
            key={survey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="survey-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-surface-800 group-hover:text-primary transition-colors">
                  {survey.title}
                </h3>
                <p className="text-sm text-surface-600 mt-1">{survey.description}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                survey.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {survey.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center text-surface-600">
                <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                {format(survey.createdAt, 'MMM d, yyyy')}
              </div>
              <div className="flex items-center text-surface-600">
                <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                {survey.responses} responses
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setCurrentSurvey(survey)}
                className="btn-primary text-sm px-4 py-2"
              >
                <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => generateShareLink(survey.id)}
                className="btn-secondary text-sm px-4 py-2"
              >
                <ApperIcon name="Share2" className="h-4 w-4 mr-1" />
                Share
              </button>
              <button 
                onClick={() => handleDeleteSurvey(survey.id)}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <ApperIcon name="Trash2" className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderBuilder = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-800">Survey Builder</h2>
          <p className="text-surface-600">
            {currentSurvey ? `Editing: ${currentSurvey.title}` : 'Select a survey to edit'}
          </p>
        </div>
        {currentSurvey && (
          <button
            onClick={() => setShowQuestionForm(true)}
            className="btn-primary"
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Question
          </button>
        )}
      </div>

      {!currentSurvey ? (
        <div className="card-neu p-12 text-center">
          <ApperIcon name="FileText" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-800 mb-2">No Survey Selected</h3>
          <p className="text-surface-600 mb-6">Select a survey from the dashboard to start building questions.</p>
          <button
            onClick={() => setCurrentSurvey(surveys[0])}
            className="btn-primary"
            disabled={surveys.length === 0}
          >
            Load First Survey
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question Types Palette */}
          {showQuestionForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card-neu p-6"
            >
              <h3 className="font-semibold text-surface-800 mb-4">Add New Question</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {questionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewQuestion({...newQuestion, type: type.id})}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      newQuestion.type === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    <ApperIcon name={type.icon} className="h-5 w-5 text-primary mb-2" />
                    <p className="font-medium text-surface-800">{type.label}</p>
                    <p className="text-sm text-surface-600">{type.description}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your question..."
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  className="input-field"
                />

                {(newQuestion.type === 'multiple' || newQuestion.type === 'dropdown') && (
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Options</label>
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options]
                              newOptions[index] = e.target.value
                              setNewQuestion({...newQuestion, options: newOptions})
                            }}
                            className="input-field"
                          />
                          <button
                            onClick={() => {
                              const newOptions = newQuestion.options.filter((_, i) => i !== index)
                              setNewQuestion({...newQuestion, options: newOptions})
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <ApperIcon name="X" className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setNewQuestion({...newQuestion, options: [...newQuestion.options, '']})}
                        className="btn-secondary w-full"
                      >
                        <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                        Add Option
                      </button>
                    </div>
                  </div>
                )}

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newQuestion.required}
                    onChange={(e) => setNewQuestion({...newQuestion, required: e.target.checked})}
                    className="rounded border-surface-300"
                  />
                  <span className="text-sm text-surface-700">Required question</span>
                </label>

                <div className="flex gap-3">
                  <button onClick={handleAddQuestion} className="btn-primary">
                    Add Question
                  </button>
                  <button 
                    onClick={() => setShowQuestionForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="question-builder group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <ApperIcon 
                        name={questionTypes.find(t => t.id === question.type)?.icon || 'Type'} 
                        className="h-4 w-4 text-primary" 
                      />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-surface-600">
                        Question {index + 1}
                      </span>
                      <span className="ml-2 text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded">
                        {questionTypes.find(t => t.id === question.type)?.label}
                      </span>
                      {question.required && (
<span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingQuestion(question)
                        setShowConditionalBuilder(true)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-all"
                      title="Add Conditional Logic"
                    >
                      <ApperIcon name="GitBranch" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-surface-800 font-medium mb-3">{question.text}</p>
                {question.options && (
                  <div className="space-y-1">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2 text-sm text-surface-600">
                        <ApperIcon name="Circle" className="h-3 w-3" />
                        <span>{option}</span>
                      </div>
                    ))}
</div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Conditional Logic Builder */}
          <AnimatePresence>
            {showConditionalBuilder && editingQuestion && (
              <ConditionalLogicBuilder
                question={editingQuestion}
                questions={questions}
                conditionTypes={conditionTypes}
                actionTypes={actionTypes}
                onUpdate={(conditionalLogic) => handleUpdateConditionalLogic(editingQuestion.id, conditionalLogic)}
                onClose={() => {
                  setShowConditionalBuilder(false)
                  setEditingQuestion(null)
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )

  const renderAnalytics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-surface-800">Analytics Dashboard</h2>
        <p className="text-surface-600">Insights and metrics from your surveys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Overview */}
        <div className="card-neu p-6">
          <h3 className="font-semibold text-surface-800 mb-4">Response Overview</h3>
          <div className="space-y-4">
            {surveys.slice(0, 3).map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="font-medium text-surface-800">{survey.title}</p>
                  <p className="text-sm text-surface-600">{survey.responses} responses</p>
                </div>
                <div className="text-right">
                  <div className="h-2 w-24 bg-surface-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((survey.responses / 50) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-surface-600 mt-1">{Math.round((survey.responses / 50) * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rates */}
        <div className="card-neu p-6">
          <h3 className="font-semibold text-surface-800 mb-4">Completion Rates</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12"/>
                  <circle 
                    cx="60" cy="60" r="54" fill="none" stroke="#3b82f6" strokeWidth="12"
                    strokeDasharray={`${78 * 3.39} 339`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-surface-800">78%</span>
                </div>
              </div>
              <p className="text-surface-600">Average completion rate</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-neu p-6 lg:col-span-2">
          <h3 className="font-semibold text-surface-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New response', survey: 'Customer Satisfaction Survey', time: '2 minutes ago', icon: 'MessageSquare' },
              { action: 'Survey published', survey: 'Product Feedback Form', time: '1 hour ago', icon: 'Send' },
              { action: 'Question added', survey: 'Employee Feedback Form', time: '3 hours ago', icon: 'Plus' },
              { action: 'Survey created', survey: 'Market Research Survey', time: '1 day ago', icon: 'FileText' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-surface-50 rounded-xl transition-colors">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ApperIcon name={activity.icon} className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-surface-800">{activity.action}</p>
                  <p className="text-sm text-surface-600">{activity.survey}</p>
                </div>
                <span className="text-sm text-surface-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderShare = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-surface-800">Share & Settings</h2>
        <p className="text-surface-600">Configure sharing options and survey settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Share Links */}
        <div className="card-neu p-6">
          <h3 className="font-semibold text-surface-800 mb-4">Share Survey</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Select Survey</label>
              <select className="input-field">
                {surveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>{survey.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Public Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/survey/1`}
                  readOnly
                  className="input-field bg-surface-50"
                />
                <button
                  onClick={() => generateShareLink('1')}
                  className="btn-primary px-4"
                >
                  <ApperIcon name="Copy" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-surface-300" defaultChecked />
                <span className="text-sm text-surface-700">Allow anonymous responses</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-surface-300" />
                <span className="text-sm text-surface-700">Require email for responses</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-surface-300" defaultChecked />
                <span className="text-sm text-surface-700">Show progress bar</span>
              </label>
            </div>
          </div>
        </div>

        {/* Survey Settings */}
        <div className="card-neu p-6">
          <h3 className="font-semibold text-surface-800 mb-4">Survey Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Start Date</label>
              <input type="date" className="input-field" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">End Date</label>
              <input type="date" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Response Limit</label>
              <input type="number" placeholder="Maximum responses (optional)" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Thank You Message</label>
              <textarea 
                rows="3" 
                placeholder="Thank you for your response!" 
                className="input-field resize-none"
              />
            </div>

            <button className="btn-primary w-full">
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-96">
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'builder' && renderBuilder()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'share' && renderShare()}
      </AnimatePresence>
    </div>
  )
}

// Create Survey Modal Component
const CreateSurveyModal = ({ onCreateSurvey }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a survey title')
      return
    }
    onCreateSurvey(title, description)
    setTitle('')
    setDescription('')
    setIsOpen(false)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
        Create Survey
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-surface-800 mb-4">Create New Survey</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter survey title..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description (optional)..."
                  rows="3"
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">Create Survey</button>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
</motion.div>
        </div>
      )}
    </>
  )
}
// Conditional Logic Builder Component
const ConditionalLogicBuilder = ({ question, questions, conditionTypes, actionTypes, onUpdate, onClose }) => {
  const [conditionalLogic, setConditionalLogic] = useState(question.conditionalLogic || { conditions: [], actions: [] })
  
  const addCondition = () => {
    const newCondition = {
      id: Date.now().toString(),
      targetQuestion: '',
      type: 'equals',
      value: '',
      operator: 'and'
    }
    setConditionalLogic({
      ...conditionalLogic,
      conditions: [...conditionalLogic.conditions, newCondition]
    })
  }

  const addAction = () => {
    const newAction = {
      id: Date.now().toString(),
      type: 'show_question',
      targetQuestion: ''
    }
    setConditionalLogic({
      ...conditionalLogic,
      actions: [...conditionalLogic.actions, newAction]
    })
  }

  const updateCondition = (conditionId, updates) => {
    setConditionalLogic({
      ...conditionalLogic,
      conditions: conditionalLogic.conditions.map(c => 
        c.id === conditionId ? { ...c, ...updates } : c
      )
    })
  }

  const updateAction = (actionId, updates) => {
    setConditionalLogic({
      ...conditionalLogic,
      actions: conditionalLogic.actions.map(a => 
        a.id === actionId ? { ...a, ...updates } : a
      )
    })
  }

  const removeCondition = (conditionId) => {
    setConditionalLogic({
      ...conditionalLogic,
      conditions: conditionalLogic.conditions.filter(c => c.id !== conditionId)
    })
  }

  const removeAction = (actionId) => {
    setConditionalLogic({
      ...conditionalLogic,
      actions: conditionalLogic.actions.filter(a => a.id !== actionId)
    })
  }

  const handleSave = () => {
    onUpdate(conditionalLogic)
    onClose()
    toast.success('Conditional logic saved successfully!')
  }

  // Get available target questions (only previous questions)
  const availableQuestions = questions.filter(q => q.id !== question.id)

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="card-neu p-6 border-2 border-purple-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <ApperIcon name="GitBranch" className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-800">Conditional Logic Builder</h3>
            <p className="text-sm text-surface-600">Create dynamic branching based on previous answers</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ApperIcon name="X" className="h-4 w-4" />
        </button>
      </div>

      {availableQuestions.length === 0 && (
        <div className="text-center p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-800 font-medium">No Previous Questions Available</p>
          <p className="text-sm text-amber-600">Add questions before this one to create conditional logic.</p>
        </div>
      )}

      {availableQuestions.length > 0 && (
        <div className="space-y-6">
          {/* Conditions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-surface-800">Conditions</h4>
              <button onClick={addCondition} className="btn-secondary text-sm px-3 py-1">
                <ApperIcon name="Plus" className="h-3 w-3 mr-1" />
                Add Condition
              </button>
            </div>
            
            {conditionalLogic.conditions.length === 0 ? (
              <div className="text-center p-4 bg-surface-50 border-2 border-dashed border-surface-300 rounded-lg">
                <p className="text-surface-500">No conditions added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conditionalLogic.conditions.map((condition, index) => (
                  <ConditionalRuleItem
                    key={condition.id}
                    condition={condition}
                    index={index}
                    availableQuestions={availableQuestions}
                    conditionTypes={conditionTypes}
                    onUpdate={(updates) => updateCondition(condition.id, updates)}
                    onRemove={() => removeCondition(condition.id)}
                    showOperator={index > 0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-surface-800">Actions</h4>
              <button onClick={addAction} className="btn-secondary text-sm px-3 py-1">
                <ApperIcon name="Plus" className="h-3 w-3 mr-1" />
                Add Action
              </button>
            </div>
            
            {conditionalLogic.actions.length === 0 ? (
              <div className="text-center p-4 bg-surface-50 border-2 border-dashed border-surface-300 rounded-lg">
                <p className="text-surface-500">No actions added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conditionalLogic.actions.map((action) => (
                  <div key={action.id} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="bg-green-100 p-2 rounded">
                      <ApperIcon name="Zap" className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={action.type}
                        onChange={(e) => updateAction(action.id, { type: e.target.value })}
                        className="input-field text-sm"
                      >
                        {actionTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                      {(action.type === 'show_question' || action.type === 'hide_question' || action.type === 'jump_to_question') && (
                        <select
                          value={action.targetQuestion}
                          onChange={(e) => updateAction(action.id, { targetQuestion: e.target.value })}
                          className="input-field text-sm"
                        >
                          <option value="">Select question...</option>
                          {questions.map((q, idx) => (
                            <option key={q.id} value={q.id}>Question {idx + 1}: {q.text.substring(0, 30)}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <button
                      onClick={() => removeAction(action.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save/Cancel Actions */}
          <div className="flex gap-3 pt-4 border-t border-surface-200">
            <button onClick={handleSave} className="btn-primary">
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              Save Logic
            </button>
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Conditional Rule Item Component
const ConditionalRuleItem = ({ condition, index, availableQuestions, conditionTypes, onUpdate, onRemove, showOperator }) => {
  const selectedQuestion = availableQuestions.find(q => q.id === condition.targetQuestion)
  const selectedConditionType = conditionTypes.find(c => c.id === condition.type)
  const needsValue = !['is_empty', 'is_not_empty'].includes(condition.type)

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      {showOperator && (
        <div className="mb-3">
          <select
            value={condition.operator}
            onChange={(e) => onUpdate({ operator: e.target.value })}
            className="input-field text-sm w-24"
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2 rounded">
          <ApperIcon name="HelpCircle" className="h-4 w-4 text-blue-600" />
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Target Question */}
          <select
            value={condition.targetQuestion}
            onChange={(e) => onUpdate({ targetQuestion: e.target.value })}
            className="input-field text-sm"
          >
            <option value="">Select question...</option>
            {availableQuestions.map((q, idx) => (
              <option key={q.id} value={q.id}>
                Question {idx + 1}: {q.text.substring(0, 30)}
              </option>
            ))}
          </select>

          {/* Condition Type */}
          <select
            value={condition.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="input-field text-sm"
          >
            {conditionTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>

          {/* Condition Value */}
          {needsValue && (
            <div>
              {selectedQuestion && (selectedQuestion.type === 'multiple' || selectedQuestion.type === 'dropdown') ? (
                <select
                  value={condition.value}
                  onChange={(e) => onUpdate({ value: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="">Select option...</option>
                  {selectedQuestion.options?.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              ) : selectedQuestion && selectedQuestion.type === 'rating' ? (
                <select
                  value={condition.value}
                  onChange={(e) => onUpdate({ value: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="">Select rating...</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter value..."
                  value={condition.value}
                  onChange={(e) => onUpdate({ value: e.target.value })}
                  className="input-field text-sm"
                />
              )}
            </div>
          )}
        </div>

        <button
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </button>
      </div>

      {/* Rule Preview */}
      {condition.targetQuestion && condition.type && (
<div className="mt-3 p-2 bg-white border border-blue-300 rounded text-xs text-blue-800">
          <strong>Rule:</strong> If Question {availableQuestions.findIndex(q => q.id === condition.targetQuestion) + 1} {' '}
          {selectedConditionType?.label.toLowerCase()} {needsValue && condition.value && `"${condition.value}"`}
        </div>
      )}
    </div>
  )
}

export default MainFeature