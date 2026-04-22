import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem('appMode') || 'user'); // 'user' or 'coordinator'
    const [coordinatorType, setCoordinatorType] = useState(localStorage.getItem('coordinatorType') || null); // 'Event', 'Sport', 'Club'

    useEffect(() => {
        localStorage.setItem('appMode', mode);
        if (coordinatorType) {
            localStorage.setItem('coordinatorType', coordinatorType);
        } else {
            localStorage.removeItem('coordinatorType');
        }
    }, [mode, coordinatorType]);

    const login = (type, password) => {
        const credentials = {
            'Event': 'event123',
            'Sport': 'sport123',
            'Club': 'club123'
        };

        if (credentials[type] === password) {
            setMode('coordinator');
            setCoordinatorType(type);
            return true;
        }
        return false;
    };

    const logout = () => {
        setMode('user');
        setCoordinatorType(null);
    };

    return (
        <AuthContext.Provider value={{ mode, coordinatorType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
