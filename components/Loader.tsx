// Loader takes in a prop 'show'
export default function Loader({ show }) {
  // If show prop is true display a div else null
  return show ? <div className="loader"> </div> : null;
}
