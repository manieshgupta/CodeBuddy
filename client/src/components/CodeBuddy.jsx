import React from 'react'
import Header from "./Header";
import CodeExplainForm from './forms/CodeExplainForm';

function CodeBuddy() {
    return (
        <div className="min-h-screen flex flex-col items-center p-6">            <Header />
            <CodeExplainForm />
        </div>
    )
}

export default CodeBuddy