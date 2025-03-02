import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { auth, db } from './firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import SignIn from './pages/SignInPage';
import ChatRoom from './pages/ChatRoom';

function App() {
  const [user] = useAuthState(auth);
  const [resetError, setResetError] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<string>('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSuccess('Password reset email sent! Check your inbox.');
      setEmail('');
      setTimeout(() => setShowResetForm(false), 3000);
    } catch (error: any) {
      setResetError(error.message);
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <header className="flex justify-between text-center items-center mb-8 glass-effect p-4">
        <h1 className="text-3xl font-bold text-indigo-400 ml-7">FireChat</h1>
        <div className="flex gap-2">
          {user && <ResetPassword onClick={() => setShowResetForm(true)} />}
          <SignOut />
        </div>
      </header>

      <section className="glass-effect p-6">
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      
      {showResetForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="glass-effect p-6 w-full max-w-md">
            <h2 className="text-xl text-white font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded"
                required
              />
              {resetError && <p className="text-red-500 mb-4">{resetError}</p>}
              {resetSuccess && <p className="text-green-500 mb-4">{resetSuccess}</p>}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-all"
                  onClick={() => setShowResetForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
                >
                  Send Reset Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button 
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all" 
      onClick={() => auth.signOut()}
    >
      Sign Out
    </button>
  )
}

function ResetPassword({ onClick }: { onClick: () => void }) {
  return (
    <button 
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all" 
      onClick={onClick}
    >
      Reset Password
    </button>
  );
}

export default App;