import userTypes from "./user.types";

export const emailSignInStart = userCredentials => ({
    type: userTypes.EMAIL_SIGN_IN_START,
    payload: userCredentials
});

export const signInSuccess = user => ({
    type: userTypes.SIGN_IN_SUCCESS,
    payload: user
});

export const setCurrentUser = user =>  ({
    type: userTypes.SET_CURRENT_USER,
    payload: user
    
});

export const checkUserSession = () => ({
    type: userTypes.CHECK_USER_SESSION
});

export const signOutUserStart = () => ({
    type: userTypes.SIGN_OUT_USER_START
});

export const signOutUserSuccess = () => ({
    type: userTypes.SIGN_OUT_USER_SUCCESS
});

export const signUpUserStart = userCredential => ({
    type: userTypes.SIGN_UP_USER_START,
    payload: userCredential
})

export const resetUserState = () => ({
    type: userTypes.RESET_USER_STATE
})


export const resetAllAuthForms = () => ({
    type: userTypes.RESET_AUTH_FORMS
});

export const userError = err => ({
    type: userTypes.USER_ERROR,
    payload: err
});

export const clearUserError = () =>({
    type: userTypes.USER_ERROR
})

export const resetPasswordStart = userCredentials => ({
    type: userTypes.RESET_PASSWORD_START,
    payload: userCredentials
});

export const resetPasswordSuccess = () => ({
    type: userTypes.RESET_PASSWORD_SUCCESS,
    payload: true
});

export const googleSignInStart = () => ({
    type: userTypes.GOOGLE_SIGN_IN_START
});

export const twitterSignInStart = () => ({
    type: userTypes.TWITTER_SIGN_IN_START
});
  
  export const appleSignInStart = () => ({
    type: userTypes.APPLE_SIGN_IN_START
});


export const newsLetterSignUpStart = email => ({
    type: userTypes.NEWSLETTER_SIGN_UP_START,
    payload: email
})

export const signInFailure = (error) => ({
    type: 'SIGN_IN_FAILURE',
    payload: error,
  });