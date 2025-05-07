// client/src/components/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    username: string;
    _id: string;
    role: string;
    login: (username: string, userId: string, role: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthState>({
    isAuthenticated: false,
    username: '',
    _id: '',
    role: '',
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [_id, set_Id] = useState('');
    const [role, setRole] = useState('');

    const login = (username: string, _id: string, role: string) => {
        setIsAuthenticated(true);
        setUsername(username);
        set_Id(_id);
        setRole(role);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername('');
        set_Id('');
        setRole('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, _id, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
