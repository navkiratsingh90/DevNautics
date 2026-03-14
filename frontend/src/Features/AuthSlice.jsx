import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	
	userId : undefined,
	user : null,
	isLoggedin : localStorage.getItem('isLoggedin'),
	email: '',
	isLoading: false,
	passShown : false,
	checked : false,
	LoginFields : {
		username: '',
		password: '',
},
	RegisterFields : {
		username: '',
		password: '',
		email : '',
	},
	LogoutFields : {
		username: '',
		password: '',
	}
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
		handleLoading: (state,action) => {
			state.isLoading = action.payload
		},
		handleCredentials: (state, action) => {
			// console.log("done");
			const data = action.payload;

			console.log(data);
			// state.user = data
			state.userId = data._id
			// console.log(JSON.parse(JSON.stringify(state.userId)));
		}
  },
});

// Export actions
export const {handleAds,HandlePassShown , HandleCheck, HandleLoginInputs, HandleRegisterInputs, HandleLogoutInputs, HandleToken, HandleLogoutInfo,handleCredentials, handleWishlist, handleLoading, handleEmail} = AuthSlice.actions;

// Export reducer
export default AuthSlice.reducer;