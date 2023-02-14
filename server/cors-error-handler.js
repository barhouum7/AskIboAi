// cors-error-handler.js
const handleCorsError = (err) => {
if (err.message.includes('CORS')) {
    console.error('CORS Error:', err.message);
    alert('CORS Error: Access Denied');
    return {
    statusCode: 403,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'CORS Error: Access Denied' }),
    };
}
};

const handleNotFoundError = (err) => {
if (err.message.includes('Not Found')) {
    console.error('Not Found Error:', err.message);
    return {
    statusCode: 404,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'Not Found Error: Not Found' }),
    };
}
};

const handleGenericError = (err) => {
console.error('Generic Error:', err.message);
return {
    statusCode: 500,
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'Generic Error: Something went wrong' }),
};
};

export default {
handleCorsError,
handleNotFoundError,
handleGenericError,
};