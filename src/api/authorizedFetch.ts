function authorizedFetch(url: string, params?: any) {
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${import.meta.env.GITHUB_ACCESS_TOKEN}`
        },
        ...params
    })
}

export default authorizedFetch;
