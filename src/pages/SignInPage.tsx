import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    interface SignInError {
      message: string;
      code?: string;
    }

    const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: unknown) {
        const firebaseError = error as SignInError;
        setError(firebaseError.message);
        console.error('Error signing in:', firebaseError);
      }
    }
  
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <form onSubmit={signIn} className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-gray-300 text-center mt-6">Do not violate the community guidelines or you will be banned for life!</p>
      </div>
    )
}

export default SignIn;