const fs = require('fs');
const axios = require('axios');
const { isNativeError } = require('util/types');

async function checkCookieValidity(cookie) {
    try {
        const response = await axios.get('https://google.com', {
            headers: {
                'Cookie': `${cookie.name}=${cookie.value}`
            }
        });

        return {
            isValid: response.status === 200,
            isInvalid: response.status === 502,
            reason: response.status === 200 ? 'Response status is 200' : `Unexpected response status: ${response.status}`
        };
    } catch (error) {
        return {
            isValid: false,
            reason: error.message
        };
    }
}

fs.readFile('cookie.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const cookies = JSON.parse(data);
        const validCookies = [];

        for (const cookie of cookies) {
            const result = await checkCookieValidity(cookie);
            if (result.isValid) {
                console.log(`Cookie is Valid (${cookie.name}): ${result.reason}`);
                validCookies.push({
                    'name': cookie.name,
                    'value': cookie.value,
                    'domain': cookie.domain,
                    'path': cookie.path,
                    'secure': cookie.secure,
                    'sameSite': cookie.sameSite
                });
            } else {
                console.log(`Cookie is Invalid (${cookie.name}): ${result.reason}`);
            }
        }

        fs.writeFile('valid.json', JSON.stringify(validCookies, null, 4), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Valid cookies saved to valid.json');
            }
        });
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});