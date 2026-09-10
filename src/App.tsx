import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app/*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-8">
              <div className="text-center space-y-2">
                <p className="font-display text-xl font-semibold text-slate-800">App shell coming next</p>
                <a href="/" className="text-amber-600 text-sm hover:underline">
                  ← Back to landing
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
