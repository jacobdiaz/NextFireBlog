// The React Context api allows us to share data within a whole component tree!
import { createContext } from "react";

// We provide this context in the app.js file by wrapping the tree with a UserContext.Provider component
// Any component within this can share this context
export const UserContext: any = createContext({ user: null, username: null });
