import LinkButton from "../../../components/linkButton/LinkButton";
import { Link } from "react-router-dom";
import "./Home.scss";

export default function Home() {
     return (
         <div id="home-body" className="grid h-screen flex-column">
             <div className="hidden md:inline-block md:col-12 home-bar p-0">
                 <div className="grid">
                     <div className="col-2 flex align-items-center">
                         <img className="w-4rem ml-1 my-1" src="images/logo512.png" alt="App logo" />
                         <h1 id="appTitle" className="text-5xl font-bold ml-2">Waffles</h1>
                     </div>
                     <div className="col-4 col-offset-6 flex justify-content-end align-items-center">
                         <LinkButton className="text-lg secondary-button" label="Log in" route="login" />
                         <LinkButton className="text-lg secondary-button ml-2" label="Join a list" route="join" />
                         <LinkButton className="text-lg mx-2" label="Sign up" route="signup" />
                     </div>
                 </div>
             </div>
             <div className="md:hidden col-12 flex flex-column home-bar">
                 <div className="grid flex-column">
                     <div className="col-12 flex justify-content-center pb-0">
                         <img className="h-3rem mb-1" src="images/logo512.png"  alt="App logo" />
                     </div>
                     <div className="col-12 flex justify-content-center pt-0">
                         <h1 id="appTitle" className="text-3xl font-bold">Waffles</h1>
                     </div>
                 </div>
             </div>
             <div className="col-12 flex flex-grow-1 justify-content-center md:justify-content-start align-items-center">
                 <div className="grid">
                     <div className="col-12 col-offset-0 md:col-offset-1">
                         <h1 className="text-5xl md:text-8xl font-bold">Upgrade your</h1>
                         <h1 className="text-5xl md:text-8xl font-bold">productivity.</h1>
                         <h2 className="text-xl md:text-3xl mt-2 md:mt-5">Plan, organize, get things done.</h2>
                     </div>
                 </div>
             </div>
             <div className="md:hidden col-12 flex justify-content-around py-3">
                 <LinkButton className="text-lg secondary-button" label="Log in" route="login" />
                 <LinkButton className="text-lg secondary-button" label="Join a list" route="join" />
                 <LinkButton className="text-lg" label="Sign up" route="signup" />
             </div>
             <div className="home-footer col-12 py-1">
                 <div className="grid">
                     <div className="col-6 flex justify-content-center">
                         <Link className="text-sm md:hidden" to="legal/terms-and-conditions">Terms and Conditions</Link>
                         <Link className="text-md hidden md:block" to="legal/terms-and-conditions">Terms and Conditions</Link>
                     </div>
                     <div className="col-6 flex justify-content-center">
                         <Link className="text-sm md:hidden" to="legal/cookie-policy">Cookie Policy</Link>
                         <Link className="text-md hidden md:block" to="legal/cookie-policy">Cookie Policy</Link>
                     </div>
                 </div>
             </div>
         </div>
     );
}
