import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: undefined,
    email: undefined,
    password: undefined,
    level: undefined
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.level = action.payload.level;
        },
        userLoggedOut: (state, action) => {
            state.id = undefined;
            state.email = undefined;
            state.password = undefined;
            state.level = undefined;
        }
    }
})


export default authSlice.reducer;
export const { userLoggedIn, userLoggedOut } = authSlice.actions;