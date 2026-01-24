async function trigger() {
    try {
        const response = await fetch('https://www.randevumtr.com/api/cron/reminders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const text = await response.text();
        console.log('Status:', response.status);

        try {
            const data = JSON.parse(text);
            console.log('Result:', JSON.stringify(data, null, 2));
        } catch (e) {
            console.error('Failed to parse JSON. Response body:', text.substring(0, 500)); // Log first 500 chars
        }
    } catch (error) {
        console.error('Failed to trigger reminder:', error);
    }
}

trigger();
