import React from 'react'

const ChatMessage = ({message,user,setDate}) => {
    return (
        <div
            className={`flex ${(message?.senderId === user?._id) ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${(message?.senderId === user?._id)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900'
                    } shadow`}
            >
                {message?.image && <img
                    src={message.image}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-lg border"
                />}
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className={`text-xs ${(message?.senderId === user?._id) ? 'text-green-100' : 'text-gray-500'}`}>
                        {setDate(message?.createdAt)}
                    </span>
                    {(message?.senderId === user?._id) && (
                        <svg className="w-4 h-4 text-green-100" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatMessage
