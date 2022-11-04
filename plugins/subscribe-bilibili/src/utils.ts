import axios from 'axios';

const get = function (url, params) {
    return new Promise(async (resolve, reject) => {
        await axios.get(url, {
            params,
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
            }
        }).then((res) => {
            resolve(res.data);
        }).catch(e => {
            reject(e);
        })
    });
}

export const Utils = {
    get,
}
