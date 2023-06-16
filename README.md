# dater-frontend
React app using `dater` backend API's

Demo project of creating YADA (yet another dating app) that puts focus on creating dates, instead of profile swipes and matches. Premise is: users that want to meet someone through the date in a spontaneous way could do so by creating dates and accepting one user out of many and then going out and meeting IRL.

# Tech used
- React xx
- Open-API Chat-GPT 3.5 as code generator enabling the API usage on the frontend

Note: 

The main goal of the project (besides enabling API features via React) was to evaluate the ease of use of ChatGPT from the perspective of a backend engineer who has very little knowoledge of React.
Before the start, basic free course on effective `prompt engineering` was taken (source: Deeplearning platform), which I would advise to anyone that wants to get the basics on "how to" create GPT prompts and re-iterate to get the best results.

Outcome:
To counteract the many recent news and speculations will the LLM's replace programmers, my findings (atleast) at the time of testing are much more optimistic.

As someone who didnt use react before, I could not simply tell the GPT to create the whole app with the features xy. The approach needs to be granularised, e.g.:
- `Create react component that consumes backend API with GET localhost:8080/dates and displays results in table form with headers x y`

Its is simple to conclude that no Project managers or any non-tech savy people could make much use of the output which is bunch of generated React code. It is likely to assume though that in not so far future 3rd party layers on top of GPT will offer something more digestable and easier to use out of the box.

In my case I use this `one step at the time` approach to have GPT generate component by component and then assemble the final app and debug and troubleshoot the issues.
One base example where I stumbled, was where GPT did not create or connect my app components via `React routes`, but instead used `navigation` library or `navigate` functions to move from component to component.
Needles to say I then invested some time to undestand the latest workings on the React routes and navigation and instructed GPT to re-generate my components using them.

All in all it was fun experience, and I was able to create the fully running app without much previous knowledge of React, but could not blindly just copy paste the output. 
To sum up; I learned about React while instructing GPT to do the heavy lifting for me.  

## Features and functionalites
- User needs to be registered to access the app and create, join dates etc.
- Registered user can then login to the app 
- User can view/edit his profile
- User can browse available dates created by other users
- User can request to join the date 
- User can create his own date that others can join 
- User can accept request from other user

## Local setup
- Clone the repo
- Run the app through `npm init`, `npm start`

## Next features and updates
- Enable user profile updates, adding images
- Enable date updates, adding images


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
