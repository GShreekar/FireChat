import { useRef, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, addDoc, doc, getDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase/config';
import { serverTimestamp } from 'firebase/firestore';

const SendIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

function ChatRoom() {
    const dummy = useRef<HTMLSpanElement>(null);
    const messagesRef = collection(db, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(25));
    const [userDisplayName, setUserDisplayName] = useState<string>('Anonymous User');
  
    const [messages] = useCollectionData(messagesQuery, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    useEffect(() => {
        const fetchUserDisplayName = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data()?.displayName) {
                    setUserDisplayName(userSnap.data()?.displayName);
                }
            }
        };
        
        fetchUserDisplayName();
    }, [auth.currentUser]);
  
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        const { uid } = auth.currentUser;
        await addDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
            displayName: userDisplayName
        });
        setFormValue('');
        dummy.current?.scrollIntoView({ behavior: 'smooth' });
    }
  
    return (
        <>
            <main className="flex flex-col h-100 overflow-y-auto mb-4 p-2">
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>
            </main>
    
            <form onSubmit={sendMessage} className="flex bg-black/20 rounded-lg overflow-hidden shadow-glow">
                <input 
                    className="flex-1 p-4 bg-transparent text-white border-none outline-none"
                    value={formValue} 
                    onChange={(e) => setFormValue(e.target.value)} 
                    placeholder="Type a message..."
                />
                <button 
                    type="submit" 
                    disabled={!formValue}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 text-xl transition-all"
                >
                    <SendIcon />
                </button>
            </form>
        </>
    );
}

interface MessageProps {
    message: {
        id: string;
        text: string;
        uid: string;
        displayName?: string;
    }
}

function ChatMessage(props: MessageProps) {
    const { text, uid, displayName } = props.message;
    const messageClass = uid === auth.currentUser?.uid ? 'sent' : 'received';

    return (
        <div className={`flex ${messageClass === 'sent' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`flex ${messageClass === 'sent' ? 'flex-row-reverse' : 'flex-row'} max-w-xs md:max-w-md`}>
                <div className={`py-3 px-4 rounded-2xl ${
                messageClass === 'sent' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-gray-700 text-gray-200 rounded-tl-none'
                }`}>
                {displayName && (
                    <p className="text-xs opacity-75 font-medium">
                    {messageClass === 'sent' ? 'You' : displayName}
                    </p>
                )}
                <p>{text}</p>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;