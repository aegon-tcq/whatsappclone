import { Button } from '@material-ui/core'
import React from 'react'
import './Login.css'
import { auth, provider } from './firebase'
import { useStateValue } from "./StateProvider";
import { actionTypes } from './reducer'
import db from './firebase'

function Login() {
    const [{ }, dispatch] = useStateValue();
    let userDetails = {}

    const signIn = () => {


        auth.signInWithPopup(provider)
            .then((result) => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user
                })

                db.collection('userDetails').doc(result.user.email).set({
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL
                })
                console.log('user detail', result.user)
            })
            .then(() => db.collection('userDetails')
                .get()
                .then(function (querySnapshot) {

                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        userDetails[doc.id] = doc.data()

                    });
                    console.log('then',userDetails)
                }))
            .then(() => dispatch({
                type: actionTypes.SET_ALLUSERDETAILS,
                allUserDetails: userDetails
            }))
            .catch((e) => alert(e.message))

    }

    return (
        <div className='login' >
            <div className='login__container' >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/765px-WhatsApp.svg.png"
                    alt=""
                />
                <div className="login__text">
                    <h1>Sign in to WhatsApp</h1>
                </div>

                <Button type="submit" onClick={signIn}>
                    Sign In With Google
                </Button>
            </div>
        </div>
    )
}

export default Login
