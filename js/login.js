const poolData = {
    UserPoolId: 'us-east-1_tZvRzzyP1',
    ClientId: '524k6humnvtabbla0s024icqa7'
};

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
            // Here you can redirect the user to another page or perform other actions
        },
        onFailure: function(err) {
            console.error('Authentication failed', err);
            // Handle login failures e.g., display a message to the user
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User needs to set a new password
            console.log("New password required.");
    
            // You may want to prompt the user to input their new password
            // For simplicity, let's assume you have a form for this
            // Assume newPassword is the new password the user inputs
            
            var newPassword = prompt("Please enter your new password:");
    
            // For security reasons, delete attributes you don't want to update
            delete userAttributes.email_verified; // These attributes are not modifiable by the user
            // Complete the new password challenge
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        }
    });
}
