"use server";

export async function explain(prevState, formData) {
    //formData contains the entire response that we fetched from the user.
    const code = formData.get("code"); //code is the name of code text area.
    const language = formData.get("language"); //language is the name of language dropdown.
    console.log(`Generating explanation for ${language}`);
    //Now we use this response and using fetch api we pass it to our rest endpoint.
    //The name of the endpoint is /explain-code and it is a POST method.
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/explain-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, language }),
        });
        /*
        The thing we return inside the if block is the formState. 
        It has two fields success and error. If res.ok is false, then return error.
        If res.ok is true, then return success.
        
        In the CodeExplainForm when we call our useAction from the useActionState hook, 
        the first argument is this formState, the second argument is the action itself. 
        the third argument is the initial state.
        */
        if (!res.ok) {
            return {
                success: false,
                error: `Failed to fetch the results`,
                code,
                language,
            };
        }

        const data = await res.json(); //data contains our original response from the AI.

        return {
            success: true,
            data,
            code,
            language,
        };
    } catch (err) {
        return {
            success: false,
            error: `An Error Occured: ${err?.message}`,
            code,
            language,
        };
    }
}