import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import AddCourse from '../pages/educator/AddCourse';
import { AppContext } from '../context/AppContext';

// Mock Quill as it depends on DOM elements not easily available in JSDOM
vi.mock('quill', () => {
    return {
        default: vi.fn().mockImplementation(function() {
            return {
                on: vi.fn(),
                getText: vi.fn().mockReturnValue('mock text'),
                root: { innerHTML: '<p>mock description</p>' },
            };
        }),
    };
});

const mockContextValue = {
    backendUrl: 'http://localhost:5000',
    getToken: vi.fn(() => 'mock-token'),
};

describe('AddCourse Page', () => {
    it('renders the form with all required fields', () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <BrowserRouter>
                    <AddCourse />
                </BrowserRouter>
            </AppContext.Provider>
        );

        expect(screen.getByText('Course Information')).toBeInTheDocument();
        expect(screen.getByText('Course Title')).toBeInTheDocument();
        expect(screen.getByText('Instructor Name')).toBeInTheDocument();
        expect(screen.getByText('Retail Price')).toBeInTheDocument();
        expect(screen.getByText('Academic Year')).toBeInTheDocument();
        expect(screen.getByText('PUBLISH COURSE')).toBeInTheDocument();
    });
});
