export function TestAction(payload) {
    return {
        type: "TEST",
        payload: payload
    }
}

export function setLoggedStatus(userID) {
    return {
        type: "USER_LOGIN",
        payload: {
            user_id: userID
        }
    }
}