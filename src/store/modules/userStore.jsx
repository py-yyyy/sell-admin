import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.user = action.payload;
        },
        setUserAvatar: (state, action) => {
            state.user.imgUrl = action.payload;
        }
    }
})

export const { setUserInfo, setUserAvatar } = userSlice.actions;
export default userSlice.reducer;
