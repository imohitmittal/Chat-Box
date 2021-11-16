import React from 'react'
import firebase from 'firebase/app'
import {  Container, Grid,Row,Panel,Col, Button, Icon, Alert } from 'rsuite'
import { auth, database } from '../misc/firebase'


const SignIn = () => {

  const SignInWithProvider =async Provider =>{
    try{
      const {additionalUserInfo,user} =await auth.signInWithPopup(Provider);
      if(additionalUserInfo.isNewUser){
        await database.ref(`/profiles/${user.uid}`).set({
          name:user.displayName,
          createdAt:firebase.database.ServerValue.TIMESTAMP,
        });
      }
      Alert.success('Signed in',4000);
        
    } catch (err){
      Alert.error(err.message,4000);
    }
  };

  const onFacebookSignIn = () =>{
    SignInWithProvider(new firebase.auth.FacebookAuthProvider())
  };
  const onGoogleSignIn = () =>{
    SignInWithProvider(new firebase.auth.GoogleAuthProvider())
  };

    return (
        <Container>
          <Grid className="mt-page">
            <Row>
              <Col xs={24} md={12} mdOffset={6}>
                <Panel>
                  <div className="text-center">
                    <h2>Welcome to chat</h2>
                    <p>Progressive chat platform for neophytes</p>
                  </div>
                  <div className="mt-3">
                    <Button block color="blue" onClick={onFacebookSignIn}>
                      <Icon icon="facebook" /> Continue with Facebook
                    </Button>
                    <Button block color="green" onClick={onGoogleSignIn}>
                      <Icon icon="google" /> Continue with Google
                    </Button>
                  </div>
                </Panel>
              
              </Col>
            </Row>
          </Grid>
        </Container>
    )
}

export default SignIn
