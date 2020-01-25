// Reducer
export function storeHandler(store, action) {
    console.log(action);
    console.log(store);

    switch (action.type) {
        case 'USER_LOGIN':
            store.user.user_id = action.payload.user_id;
            return store;
        default:
            return store;
    }
}
