const poolData = {
    UserPoolId: 'us-east-1_bfUX9IBS2',
    ClientId: '6al7m2d7btkhf9ja7tmn0gb2gu'
};

let globalUserAttributes = {};

function signIn(username, password) {
    const authenticationData = { Username: username, Password: password };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = { Username: username, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('Authentication successful');
            console.log('Access Token:', result.getAccessToken().getJwtToken());
            
            const accessToken = result.getAccessToken().getJwtToken();
            // Here you can redirect the user to another page or perform other actions
        },
        onFailure: function(err) {
            console.error('Authentication failed', err);
            // Handle login failures e.g., display a message to the user
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // globalUserAttributes = userAttributes;
            // showNewPasswordForm();
            // User needs to set a new password
            console.log("New password required.");   
            // You may want to prompt the user to input their new password
            // For simplicity, let's assume you have a form for this
            // Assume newPassword is the new password the user inputs
            
            var newPassword = prompt("Please enter your new password:");
            console.log(userAttributes);
    
            // For security reasons, delete attributes you don't want to update
            delete userAttributes.email_verified; // These attributes are not modifiable by the user
            delete userAttributes.email;
            // Complete the new password challenge
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        },
        mfaRequired: function(codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            var verificationCode = prompt('Please input verification code ', '');
            cognitoUser.sendMFACode(verificationCode, this);
        },
    
        mfaSetup: function(challengeName, challengeParameters) {
            // Handle MFA setup if necessary. This part is typically for NEW_PASSWORD_REQUIRED challenges
            // or for setting up MFA on a user's account. It's uncommon for the initial login flow.
            console.log("MFA SETUP");

            cognitoUser.associateSoftwareToken(this);
        },
        associateSecretCode: async secretCode => {
            console.log("SECRET CODE: ", secretCode);
            //await this.setState({ QRCode: secretCode, showQRCode: true });
            setTimeout(() => {
              const challengeAnswer = prompt("Please input the TOTP code.", "");
              cognitoUser.verifySoftwareToken(challengeAnswer, "My TOTP device", {
                onSuccess: session => console.log("SUCCESS TOTP: ", session),
                onFailure: err => console.error("ERROR TOTP: ", err)
              });
            }, 2000);
        },
        totpRequired: function(secretCode) {
            var challengeAnswer = prompt("Please input the TOTP code.", "");
            cognitoUser.sendMFACode(challengeAnswer, this, "SOFTWARE_TOKEN_MFA");
        }

    });
    
    // Call showNewPasswordForm() in your newPasswordRequired callback
    
}

function showNewPasswordForm() {
    document.getElementById('newPasswordRequiredForm').style.display = 'block';
}