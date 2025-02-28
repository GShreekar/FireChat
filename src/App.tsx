import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import SignIn from './pages/SignInPage';
import ChatRoom from './pages/ChatRoom';

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <header className="flex justify-between text-center items-center mb-8 glass-effect p-4">
        <h1 className="text-3xl font-bold text-indigo-400 ml-7">FireChat</h1>
        <SignOut />
      </header>

      <section className="glass-effect p-6">
        {user ? <ChatRoom /> : <SignIn />}
      </section>
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





export default App;