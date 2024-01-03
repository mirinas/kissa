import React, { useState, useEffect } from 'react';
import '../styles/LoginRegister.css'

export default function RegisterPage() {

    let state = 2;

    switch (state) {
        case 1:
            return (
                <>
                    <div className='center_div'>
                        <h2 className='bigtext'>Purrfect! <br></br> Let's create your profile!</h2>
                    </div>
                </>
            );

        case 2:
            return (
                <div className="center_div">

                    <div>
                        <h2 className='smalltext'>How can we call you?</h2>
                        <input type="text" placeholder="Name"></input>
                        <input type="text" placeholder="Surname"></input>
                    </div>

                    <div>
                        <h2 className='smalltext'>What's your sex?</h2>
                        <label class="radio">Male
                            <input type="radio" name="radio"></input>
                            <span class="checkmark"></span>
                        </label>
                        <label class="radio">Female
                            <input type="radio" name="radio"></input>
                            <span class="checkmark"></span>
                        </label>
                        <label class="radio">Other
                            <input type="radio" name="radio"></input>
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <div>
                        <h2 className='smalltext'>Why do you want to join us?</h2>
                        <textarea placeholder="I want to find other cat people" name="multilineInput" rows="4" cols="50"></textarea>
                    </div>

                    <div>
                        <h2 className='smalltext'>When were you born?</h2>
                        <input type="date" placeholder="dd/mm/yy"></input>
                    </div>

                    <div className='smalltext'>
                        <h2 className='smalltext'>How do you look?</h2>
                        <p className='smallertext'> We <strong><em>won't</em></strong> share it publicly</p>
                        <button className="btn_kissa"> Select image</button>
                        <br></br>
                        <button className="btn_kissa">Next</button>
                    </div>

                </div>
            );
        case 3:
            return (
                <>
                    <div className='center_div'>
                        <h2 className='bigtext'>Pawsome! <br></br> Let's hear about your furry</h2>
                    </div>
                </>
            );

        case 4:
            return (
                <div className="center_div">

                    <div>
                        <h2 className='smalltext'>What are the special traits?</h2>
                        <textarea placeholder="She likes to play with bananas" name="multilineInput" rows="4" cols="50"></textarea>
                    </div>

                    <div>
                        <h2 className='smalltext'>What's your beloved furry's name?</h2>
                        <input type="text" placeholder="Name"></input>
                    </div>

                    <div>
                        <h2 className='smalltext'>What's your furry's sex?</h2>
                        <label class="radio">Male
                            <input type="radio" name="radio"></input>
                            <span class="checkmark"></span>
                        </label>
                        <label class="radio">Female
                            <input type="radio" name="radio"></input>
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <div className='smalltext'>
                        <h2 className='smalltext'>How does he/she look?</h2>
                        <p className='smallertext'> We <strong><em>will</em></strong> share it publicly</p>
                        <button className="btn_kissa">Select images(3)</button>
                        <br></br>
                        <button className="btn_kissa">Next</button>
                    </div>

                </div>
            );

        case 5:
            return (
                <>
                    <div className='center_div'>
                        <h2 className='bigtext'>Meowtastic! <br></br> We are creating your profile</h2>
                    </div>
                </>
            );

        default:
            return ("");
    }
}