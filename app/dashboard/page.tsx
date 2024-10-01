/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
import { AuthProvider } from "../components/AuthContext";
import Dashboard from "../components/Dashboard";

export default function () {
    <AuthProvider>
    return <Dashboard />
    </AuthProvider>
}