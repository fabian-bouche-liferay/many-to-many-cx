class ApiService {

    static makeCall(url, method, body) {

        let call = window.Liferay.Util
            .fetch(url, {
                method: method,
                ...(body ? { headers: { 'Content-Type': 'application/json'} } : {}),
                ...(body ? { body: JSON.stringify(body) } : {})
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                if (response.status === 204) {
                    return null;
                }

                return response.json();
            });

        return call.then(data => {
            console.log(data);
            return data;
        });

    }

}

export default ApiService;