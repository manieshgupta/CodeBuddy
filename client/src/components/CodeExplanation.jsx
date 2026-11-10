import { useState, useRef, useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const CodeExplanation = ({ explanation }) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef(null);

    // Clear the timer if the component unmounts mid-countdown
    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(explanation);
            setCopied(true);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="w-full max-w-4xl mt-6 bg-gray-50 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Explanation:</h2>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? "Copied" : "Copy explanation to clipboard"}
                    title={copied ? "Copied!" : "Copy"}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition"
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="text-green-600">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    )}
                </button>
            </div>
            <Markdown remarkPlugins={[remarkGfm]}>{explanation}</Markdown>
        </div>
    );
};

export default CodeExplanation;